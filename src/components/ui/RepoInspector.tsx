import React, { useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Star, 
  GitFork, 
  AlertCircle, 
  Tag, 
  Calendar, 
  Scale, 
  ChevronLeft, 
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { PlanetNode } from '../../types';

interface RepoInspectorProps {
  planet: PlanetNode;
  allPlanets: PlanetNode[];
  onClose: () => void;
  onSelectPlanet: (planet: PlanetNode) => void;
}

export const RepoInspector: React.FC<RepoInspectorProps> = ({
  planet,
  allPlanets,
  onClose,
  onSelectPlanet,
}) => {
  const repo = planet.repo;

  // Keyboard navigation: ESC to close, Left/Right arrow to cycle planets
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = allPlanets.findIndex(p => p.id === planet.id);
        const prevIndex = (currentIndex - 1 + allPlanets.length) % allPlanets.length;
        onSelectPlanet(allPlanets[prevIndex]);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = allPlanets.findIndex(p => p.id === planet.id);
        const nextIndex = (currentIndex + 1) % allPlanets.length;
        onSelectPlanet(allPlanets[nextIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [planet, allPlanets, onClose, onSelectPlanet]);

  const currentIndex = allPlanets.findIndex(p => p.id === planet.id);

  // Format updated date naturally
  const formattedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <aside 
      aria-label="Repository Details"
      className="fixed top-20 right-4 sm:right-6 z-30 w-[calc(100vw-32px)] sm:w-96 p-5 rounded-2xl border border-white/15 bg-[#070b14]/95 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-md pointer-events-auto transition-all animate-in fade-in slide-in-from-right duration-200"
    >
      {/* Header bar with Archetype badge & Close button */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span 
            className="w-3 h-3 rounded-full shrink-0 shadow-sm"
            style={{ backgroundColor: planet.color }}
          />
          <span className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider">
            {planet.archetype.replace('_', ' ')}
          </span>
          {planet.hasRings && (
            <span className="text-[10px] font-mono text-slate-400">· RINGED</span>
          )}
          {planet.moonCount > 0 && (
            <span className="text-[10px] font-mono text-slate-400">· {planet.moonCount} MOON{planet.moonCount > 1 ? 'S' : ''}</span>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Close Inspector (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Repository Title */}
      <h2 className="text-xl font-bold font-sans text-white break-words tracking-tight leading-snug mb-2">
        {repo.name}
      </h2>

      {/* Description */}
      <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
        {repo.description || 'No description provided for this planetary repository.'}
      </p>

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-white/10 mb-4 text-center">
        <div>
          <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-amber-300">
            <Star className="w-3 h-3 fill-amber-300" />
            <span className="font-bold">{repo.stargazers_count.toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-sans mt-0.5">Stars</div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-cyan-400">
            <GitFork className="w-3 h-3" />
            <span className="font-bold">{repo.forks_count.toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-sans mt-0.5">Forks</div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-slate-300">
            <AlertCircle className="w-3 h-3" />
            <span className="font-bold">{repo.open_issues_count}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-sans mt-0.5">Issues</div>
        </div>
      </div>

      {/* Metadata list */}
      <div className="space-y-1.5 text-xs text-slate-300 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between py-0.5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Tag className="w-3 h-3" /> Primary Language
          </span>
          <span className="font-mono text-white font-medium">{repo.language || 'Plain Text'}</span>
        </div>

        <div className="flex items-center justify-between py-0.5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Last Orbital Sync
          </span>
          <span className="font-mono text-white">{formattedDate}</span>
        </div>

        <div className="flex items-center justify-between py-0.5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <HardDrive className="w-3 h-3" /> Planetary Mass
          </span>
          <span className="font-mono text-white">{(repo.size / 1024).toFixed(1)} MB</span>
        </div>

        {repo.license && (
          <div className="flex items-center justify-between py-0.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Scale className="w-3 h-3" /> License
            </span>
            <span className="font-mono text-white truncate max-w-[140px] text-right" title={repo.license.name}>
              {repo.license.spdx_id || repo.license.name}
            </span>
          </div>
        )}
      </div>

      {/* Topics list */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="mb-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
            Topics & Constellations
          </div>
          <div className="flex flex-wrap gap-1">
            {repo.topics.slice(0, 6).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 font-mono"
              >
                #{topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions: View on GitHub & Tour Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="flex-1 py-2 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        {/* Planet Tour cycle buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const prev = (currentIndex - 1 + allPlanets.length) % allPlanets.length;
              onSelectPlanet(allPlanets[prev]);
            }}
            className="p-2 rounded-lg border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer"
            title="Previous Planet (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const next = (currentIndex + 1) % allPlanets.length;
              onSelectPlanet(allPlanets[next]);
            }}
            className="p-2 rounded-lg border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer"
            title="Next Planet (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
