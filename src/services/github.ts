import { GitHubUser, GitHubRepo, UniverseData } from '../types';
import { DEMO_PROFILES } from '../constants/demoProfiles';
import { 
  transformReposToPlanets, 
  computeLanguageStats, 
  getStellarClassification 
} from '../utils/procedural';
import { getLanguageConfig } from '../constants/languages';

const CACHE_PREFIX = 'gitverse_cache_';

export function validateGitHubUsername(username: string): { valid: boolean; error?: string } {
  const trimmed = username.trim();
  if (!trimmed) {
    return { valid: false, error: 'Please enter a GitHub username.' };
  }
  if (trimmed.length > 39) {
    return { valid: false, error: 'GitHub usernames cannot exceed 39 characters.' };
  }
  // GitHub username rules: alphanumeric or single hyphens, cannot start/end with hyphen
  const regex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
  if (!regex.test(trimmed)) {
    return { valid: false, error: 'Invalid username. Only alphanumeric characters and single hyphens are allowed.' };
  }
  return { valid: true };
}

export interface FetchResult {
  data?: UniverseData;
  error?: string;
  isRateLimit?: boolean;
  isNotFound?: boolean;
}

export async function fetchGitHubUniverse(
  username: string, 
  onStageChange?: (stageText: string) => void
): Promise<FetchResult> {
  const cleanUsername = username.trim().toLowerCase();
  
  // 1. Check Demo Profiles first for instant latency-free resolution
  if (DEMO_PROFILES[cleanUsername]) {
    onStageChange?.('Connecting to verified telemetry stream...');
    await new Promise((r) => setTimeout(r, 400));
    const demo = DEMO_PROFILES[cleanUsername];
    return { data: buildUniverseData(demo.user, demo.repos) };
  }

  // 2. Check Session Cache
  try {
    const cached = sessionStorage.getItem(CACHE_PREFIX + cleanUsername);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.user && parsed.repos) {
        onStageChange?.('Restoring universe from local telemetry cache...');
        await new Promise((r) => setTimeout(r, 350));
        return { data: buildUniverseData(parsed.user, parsed.repos) };
      }
    }
  } catch {
    // SessionStorage unavailable or full, continue to live fetch
  }

  // 3. Live GitHub Public API Fetch
  try {
    onStageChange?.(`Acquiring public signal for @${cleanUsername}...`);
    
    // Fetch profile
    const profileRes = await fetch(`https://api.github.com/users/${cleanUsername}`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (profileRes.status === 404) {
      return {
        isNotFound: true,
        error: `User "@${cleanUsername}" was not found on GitHub. Please check the spelling.`,
      };
    }

    if (profileRes.status === 403) {
      const rateLimitReset = profileRes.headers.get('x-ratelimit-reset');
      const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : 'shortly';
      return {
        isRateLimit: true,
        error: `GitHub public API rate limit reached (resets ${resetTime}). You can explore one of our rich demo universes without any limits.`,
      };
    }

    if (!profileRes.ok) {
      return {
        error: `GitHub API error (${profileRes.status}): ${profileRes.statusText}`,
      };
    }

    const user: GitHubUser = await profileRes.json();

    // Fetch repositories
    onStageChange?.(`Cataloging star clusters for ${user.public_repos} repositories...`);
    const reposRes = await fetch(
      `https://api.github.com/users/${cleanUsername}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (reposRes.status === 403) {
      return {
        isRateLimit: true,
        error: `GitHub API rate limit reached while fetching repository catalog.`,
      };
    }

    if (!reposRes.ok) {
      return {
        error: `Could not retrieve repositories for @${cleanUsername}.`,
      };
    }

    const rawRepos: GitHubRepo[] = await reposRes.json();

    // Save in sessionStorage
    try {
      sessionStorage.setItem(
        CACHE_PREFIX + cleanUsername,
        JSON.stringify({ user, repos: rawRepos })
      );
    } catch {
      // Ignore cache storage errors
    }

    const universe = buildUniverseData(user, rawRepos);
    return { data: universe };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Network error communicating with GitHub API.',
    };
  }
}

export function buildUniverseData(user: GitHubUser, repos: GitHubRepo[]): UniverseData {
  const planets = transformReposToPlanets(repos);
  const languageBreakdown = computeLanguageStats(repos);
  const dominantLanguage = languageBreakdown.length > 0 ? languageBreakdown[0].name : 'Unknown';
  const dominantConfig = getLanguageConfig(dominantLanguage);

  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
  const classification = getStellarClassification(totalStars, repos.length);

  return {
    user,
    repos,
    planets,
    dominantLanguage,
    languageBreakdown,
    totalStars,
    totalForks,
    classification,
    stellarColor: dominantConfig.color,
    densityIndex: Math.min(100, Math.round((repos.length / 50) * 100)),
  };
}
