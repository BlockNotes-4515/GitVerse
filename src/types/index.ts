export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  topics?: string[];
  default_branch: string;
}

export type PlanetArchetype = 
  | 'terrestrial' 
  | 'gas_giant' 
  | 'ice_world' 
  | 'ringed' 
  | 'oceanic' 
  | 'volcanic';

export interface PlanetNode {
  id: string;
  repo: GitHubRepo;
  radius: number;
  color: string;
  emissiveColor: string;
  secondaryColor: string;
  archetype: PlanetArchetype;
  hasRings: boolean;
  moonCount: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  orbitalTilt: number;
  galaxyPosition: [number, number, number];
  treePosition: [number, number, number];
  branchIndex: number;
}

export interface LanguageStat {
  name: string;
  color: string;
  count: number;
  percentage: number;
}

export interface UniverseData {
  user: GitHubUser;
  repos: GitHubRepo[];
  planets: PlanetNode[];
  dominantLanguage: string;
  languageBreakdown: LanguageStat[];
  totalStars: number;
  totalForks: number;
  classification: string;
  stellarColor: string;
  densityIndex: number;
}

export type ViewMode = 'galaxy' | 'tree';

export type FormationStage = 
  | 'idle' 
  | 'signal_acquisition' 
  | 'stellar_formation' 
  | 'planetary_emergence' 
  | 'orbital_stabilization' 
  | 'ready';
