import * as THREE from 'three';
import { GitHubRepo, PlanetArchetype, PlanetNode, LanguageStat } from '../types';
import { getLanguageConfig } from '../constants/languages';

// Simple deterministic hash function (djb2)
export function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Pseudo-random number generator seeded with a number
export function createRNG(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function next(): number {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Determine planet archetype deterministically
export function resolveArchetype(repo: GitHubRepo): PlanetArchetype {
  const hash = hashString(repo.name + (repo.language || 'none'));
  const stars = repo.stargazers_count;
  const langConfig = getLanguageConfig(repo.language);

  // High star repositories (> 5,000) have higher propensity for ringed worlds or gas giants
  if (stars > 5000 && hash % 3 === 0) {
    return 'ringed';
  }
  if (stars > 2000 && hash % 4 === 0) {
    return 'gas_giant';
  }

  // Archetype influenced by language config with deterministic variance
  const archetypeOptions: PlanetArchetype[] = [
    langConfig.archetype,
    'terrestrial',
    'gas_giant',
    'ice_world',
    'oceanic',
    'volcanic',
  ];

  return archetypeOptions[hash % archetypeOptions.length];
}

// Calculate radius from stargazers and forks
export function calculatePlanetRadius(repo: GitHubRepo): number {
  const stars = Math.max(0, repo.stargazers_count);
  // Logarithmic scaling: 1.0 (0 stars) to 3.8 (100k+ stars)
  const logScaled = Math.log10(stars + 1);
  const radius = 1.0 + Math.min(2.8, logScaled * 0.55);
  return Number(radius.toFixed(2));
}

// Transform repositories into positioned 3D Planet Nodes (for Galaxy and Tree layouts)
export function transformReposToPlanets(repos: GitHubRepo[]): PlanetNode[] {
  // Sort repositories by importance (stargazers count descending, then recency)
  const sortedRepos = [...repos].sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) {
      return b.stargazers_count - a.stargazers_count;
    }
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  // Group by language for Tree Mode branching
  const languageGroups: Record<string, GitHubRepo[]> = {};
  sortedRepos.forEach(repo => {
    const lang = repo.language || 'Other';
    if (!languageGroups[lang]) languageGroups[lang] = [];
    languageGroups[lang].push(repo);
  });

  const languageKeys = Object.keys(languageGroups);

  return sortedRepos.map((repo, index) => {
    const hash = hashString(repo.name);
    const rng = createRNG(hash);
    const langConfig = getLanguageConfig(repo.language);
    const archetype = resolveArchetype(repo);
    const radius = calculatePlanetRadius(repo);

    // Galaxy Layout: Orbits expand outward from star
    // Distribute planets across concentric orbital zones
    const minOrbit = 14;
    const maxOrbit = 88;
    const orbitStep = (maxOrbit - minOrbit) / Math.max(1, sortedRepos.length);
    const orbitRadius = minOrbit + (index * orbitStep) + (rng() * 2 - 1);
    
    // Golden angle distribution for natural cosmic spiral spacing
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~2.399 rad
    const orbitAngle = (index * goldenAngle + rng() * 0.5) % (Math.PI * 2);
    const orbitalTilt = (rng() - 0.5) * 0.22; // subtle orbital inclination (radians)
    const orbitSpeed = 0.08 / Math.sqrt(orbitRadius) * (0.8 + rng() * 0.4);

    const gx = Math.cos(orbitAngle) * orbitRadius;
    const gy = Math.sin(orbitalTilt) * (orbitRadius * 0.35);
    const gz = Math.sin(orbitAngle) * orbitRadius;

    // Tree Layout: Branching hierarchy
    const lang = repo.language || 'Other';
    const branchIndex = languageKeys.indexOf(lang);
    const branchCount = Math.max(1, languageKeys.length);
    const branchAngle = (branchIndex / branchCount) * Math.PI * 2;
    const branchDist = 18 + (index % 5) * 7;
    const branchHeight = -16 + (branchIndex % 3) * 12 + (index % 4) * 5;
    const treeX = Math.cos(branchAngle) * branchDist + (rng() - 0.5) * 4;
    const treeY = branchHeight + (rng() - 0.5) * 3;
    const treeZ = Math.sin(branchAngle) * branchDist + (rng() - 0.5) * 4;

    // Moons based on forks count (capped at 4)
    let moonCount = 0;
    if (repo.forks_count > 500) moonCount = 3;
    else if (repo.forks_count > 100) moonCount = 2;
    else if (repo.forks_count > 15) moonCount = 1;

    const hasRings = archetype === 'ringed' || (repo.stargazers_count > 8000 && hash % 2 === 0);

    return {
      id: String(repo.id),
      repo,
      radius,
      color: langConfig.color,
      emissiveColor: langConfig.emissive,
      secondaryColor: langConfig.secondary,
      archetype,
      hasRings,
      moonCount,
      orbitRadius,
      orbitSpeed,
      orbitAngle,
      orbitalTilt,
      galaxyPosition: [gx, gy, gz],
      treePosition: [treeX, treeY, treeZ],
      branchIndex,
    };
  });
}

// Compute aggregate language breakdown
export function computeLanguageStats(repos: GitHubRepo[]): LanguageStat[] {
  const counts: Record<string, number> = {};
  let totalWithLang = 0;

  repos.forEach(repo => {
    if (repo.language) {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
      totalWithLang++;
    }
  });

  const stats: LanguageStat[] = Object.entries(counts).map(([name, count]) => {
    const config = getLanguageConfig(name);
    return {
      name,
      color: config.color,
      count,
      percentage: totalWithLang > 0 ? Math.round((count / totalWithLang) * 100) : 0,
    };
  });

  return stats.sort((a, b) => b.count - a.count);
}

// Derive stellar classification based on repo volume & stars
export function getStellarClassification(totalStars: number, repoCount: number): string {
  if (totalStars > 50000 || repoCount > 80) return 'Class-O Hypergiant Luminary';
  if (totalStars > 10000 || repoCount > 40) return 'Class-B Blue Supergiant Synthesizer';
  if (totalStars > 2000 || repoCount > 20) return 'Class-A White Main-Sequence Core';
  if (totalStars > 500 || repoCount > 10) return 'Class-F Radiant Stellar Weaver';
  if (totalStars > 50 || repoCount > 5) return 'Class-G Yellow Dwarf Dynamo';
  return 'Class-K Amber Protostar Engine';
}

// Procedural Canvas Texture Generator for Planets
const textureCache = new Map<string, THREE.CanvasTexture>();

export function getProceduralPlanetTexture(archetype: PlanetArchetype, colorHex: string, secondaryHex: string): THREE.CanvasTexture {
  const key = `${archetype}_${colorHex}_${secondaryHex}`;
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    return fallback;
  }

  // Base background
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 512, 256);

  if (archetype === 'gas_giant') {
    // Horizontal atmospheric bands with turbulence
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, colorHex);
    grad.addColorStop(0.2, secondaryHex);
    grad.addColorStop(0.35, '#0a0d18');
    grad.addColorStop(0.5, colorHex);
    grad.addColorStop(0.7, secondaryHex);
    grad.addColorStop(0.85, '#1e293b');
    grad.addColorStop(1, colorHex);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Storm bands
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.15)';
      const y = Math.random() * 256;
      const h = 4 + Math.random() * 12;
      ctx.fillRect(0, y, 512, h);
    }
  } else if (archetype === 'ice_world') {
    // Crystalline glacial fissures
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 256);

    // Ice sheets
    const grad = ctx.createRadialGradient(256, 128, 20, 256, 128, 240);
    grad.addColorStop(0, secondaryHex);
    grad.addColorStop(0.6, colorHex);
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Glacial cracks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 22; i++) {
      ctx.beginPath();
      let cx = Math.random() * 512;
      let cy = Math.random() * 256;
      ctx.moveTo(cx, cy);
      for (let j = 0; j < 5; j++) {
        cx += (Math.random() - 0.5) * 60;
        cy += (Math.random() - 0.5) * 40;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }
  } else if (archetype === 'volcanic') {
    // Obsidian surface with glowing lava veins
    ctx.fillStyle = '#110a08';
    ctx.fillRect(0, 0, 512, 256);

    // Lava fissures
    ctx.strokeStyle = secondaryHex;
    ctx.lineWidth = 3;
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 10;
    for (let i = 0; i < 24; i++) {
      ctx.beginPath();
      let vx = Math.random() * 512;
      let vy = Math.random() * 256;
      ctx.moveTo(vx, vy);
      for (let j = 0; j < 6; j++) {
        vx += (Math.random() - 0.5) * 70;
        vy += (Math.random() - 0.5) * 45;
        ctx.lineTo(vx, vy);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  } else if (archetype === 'oceanic') {
    // Deep oceans with archipelago continents
    ctx.fillStyle = '#08182b';
    ctx.fillRect(0, 0, 512, 256);

    // Islands / continents
    ctx.fillStyle = colorHex;
    for (let i = 0; i < 16; i++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 256;
      const cr = 20 + Math.random() * 55;
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Atmosphere haze
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 256, 90, 20, Math.random(), 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Terrestrial / rocky craters
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, 512, 256);

    // Craters
    for (let i = 0; i < 35; i++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 256;
      const cr = 5 + Math.random() * 22;
      
      ctx.beginPath();
      ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx - 2, cy - 2, cr * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  textureCache.set(key, texture);

  return texture;
}

// Procedural Ring Texture
export function getProceduralRingTexture(colorHex: string): THREE.CanvasTexture {
  const key = `ring_${colorHex}`;
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.2, colorHex);
    grad.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0.1)');
    grad.addColorStop(0.7, colorHex);
    grad.addColorStop(0.9, 'rgba(255,255,255,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 16);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  textureCache.set(key, texture);
  return texture;
}
