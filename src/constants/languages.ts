export interface LanguageConfig {
  color: string;
  secondary: string;
  emissive: string;
  archetype: 'terrestrial' | 'gas_giant' | 'ice_world' | 'ringed' | 'oceanic' | 'volcanic';
  label: string;
}

export const LANGUAGE_PALETTES: Record<string, LanguageConfig> = {
  TypeScript: {
    color: '#3178c6',
    secondary: '#60a5fa',
    emissive: '#1d4ed8',
    archetype: 'ice_world',
    label: 'TypeScript',
  },
  JavaScript: {
    color: '#f7df1e',
    secondary: '#fbbf24',
    emissive: '#b45309',
    archetype: 'gas_giant',
    label: 'JavaScript',
  },
  Python: {
    color: '#3572A5',
    secondary: '#38bdf8',
    emissive: '#1e3a8a',
    archetype: 'oceanic',
    label: 'Python',
  },
  Rust: {
    color: '#dea584',
    secondary: '#f97316',
    emissive: '#9a3412',
    archetype: 'volcanic',
    label: 'Rust',
  },
  Go: {
    color: '#00add8',
    secondary: '#38bdf8',
    emissive: '#0369a1',
    archetype: 'ice_world',
    label: 'Go',
  },
  'C++': {
    color: '#f34b7d',
    secondary: '#fb7185',
    emissive: '#be123c',
    archetype: 'ringed',
    label: 'C++',
  },
  C: {
    color: '#555555',
    secondary: '#94a3b8',
    emissive: '#334155',
    archetype: 'terrestrial',
    label: 'C',
  },
  'C#': {
    color: '#178600',
    secondary: '#4ade80',
    emissive: '#166534',
    archetype: 'oceanic',
    label: 'C#',
  },
  Java: {
    color: '#b07219',
    secondary: '#f59e0b',
    emissive: '#78350f',
    archetype: 'gas_giant',
    label: 'Java',
  },
  Ruby: {
    color: '#701516',
    secondary: '#ef4444',
    emissive: '#991b1b',
    archetype: 'volcanic',
    label: 'Ruby',
  },
  PHP: {
    color: '#4F5D95',
    secondary: '#818cf8',
    emissive: '#3730a3',
    archetype: 'gas_giant',
    label: 'PHP',
  },
  Swift: {
    color: '#F05138',
    secondary: '#fb923c',
    emissive: '#c2410c',
    archetype: 'ringed',
    label: 'Swift',
  },
  Kotlin: {
    color: '#A97BFF',
    secondary: '#c084fc',
    emissive: '#6b21a8',
    archetype: 'ice_world',
    label: 'Kotlin',
  },
  HTML: {
    color: '#e34c26',
    secondary: '#f97316',
    emissive: '#9a3412',
    archetype: 'volcanic',
    label: 'HTML',
  },
  CSS: {
    color: '#563d7c',
    secondary: '#a855f7',
    emissive: '#581c87',
    archetype: 'gas_giant',
    label: 'CSS',
  },
  Shell: {
    color: '#89e051',
    secondary: '#a3e635',
    emissive: '#3f6212',
    archetype: 'terrestrial',
    label: 'Shell',
  },
  Dart: {
    color: '#00B4AB',
    secondary: '#2dd4bf',
    emissive: '#0f766e',
    archetype: 'oceanic',
    label: 'Dart',
  },
  Elixir: {
    color: '#6e4a7e',
    secondary: '#c084fc',
    emissive: '#581c87',
    archetype: 'ringed',
    label: 'Elixir',
  },
  Scala: {
    color: '#c22d40',
    secondary: '#f87171',
    emissive: '#991b1b',
    archetype: 'volcanic',
    label: 'Scala',
  },
  Haskell: {
    color: '#5e5086',
    secondary: '#a78bfa',
    emissive: '#4c1d95',
    archetype: 'ice_world',
    label: 'Haskell',
  },
  Lua: {
    color: '#000080',
    secondary: '#60a5fa',
    emissive: '#1e3a8a',
    archetype: 'oceanic',
    label: 'Lua',
  },
  Zig: {
    color: '#ec915c',
    secondary: '#fdba74',
    emissive: '#9a3412',
    archetype: 'terrestrial',
    label: 'Zig',
  },
  Julia: {
    color: '#a270ba',
    secondary: '#e879f9',
    emissive: '#86198f',
    archetype: 'gas_giant',
    label: 'Julia',
  },
  R: {
    color: '#198CE7',
    secondary: '#38bdf8',
    emissive: '#0369a1',
    archetype: 'oceanic',
    label: 'R',
  },
  Vue: {
    color: '#41b883',
    secondary: '#34d399',
    emissive: '#065f46',
    archetype: 'oceanic',
    label: 'Vue',
  },
  Svelte: {
    color: '#ff3e00',
    secondary: '#fb923c',
    emissive: '#c2410c',
    archetype: 'volcanic',
    label: 'Svelte',
  },
  Markdown: {
    color: '#083fa1',
    secondary: '#93c5fd',
    emissive: '#1e3a8a',
    archetype: 'terrestrial',
    label: 'Markdown',
  },
  Solidity: {
    color: '#AA6746',
    secondary: '#fdba74',
    emissive: '#7c2d12',
    archetype: 'ice_world',
    label: 'Solidity',
  },
};

export const DEFAULT_LANGUAGE_PALETTE: LanguageConfig = {
  color: '#64748b',
  secondary: '#94a3b8',
  emissive: '#1e293b',
  archetype: 'terrestrial',
  label: 'Unknown / Neutral',
};

export function getLanguageConfig(language: string | null | undefined): LanguageConfig {
  if (!language) return DEFAULT_LANGUAGE_PALETTE;
  return LANGUAGE_PALETTES[language] || {
    color: '#06b6d4',
    secondary: '#67e8f9',
    emissive: '#0e7490',
    archetype: 'oceanic',
    label: language,
  };
}
