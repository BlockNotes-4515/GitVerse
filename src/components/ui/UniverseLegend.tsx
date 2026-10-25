import React from 'react';
import { X, Orbit, Circle, Layers, Disc, Globe } from 'lucide-react';
import { LanguageStat } from '../../types';

interface UniverseLegendProps {
  languageStats: LanguageStat[];
  onClose: () => void;
}

export const UniverseLegend: React.FC<UniverseLegendProps> = ({
  languageStats,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-xl p-6 rounded-2xl border border-white/15 bg-[#070b14]/95 shadow-2xl overflow-y-auto max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <Orbit className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-sans text-white">
              Cosmic Visualization Legend
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-6 text-xs text-slate-300">
          {/* Mapping 1: Celestial Core & Scale */}
          <div>
            <div className="flex items-center gap-2 text-white font-semibold font-sans text-sm mb-2">
              <Circle className="w-4 h-4 text-cyan-400" />
              <span>Planet Size & Scale</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Planet radius is scaled logarithmically from the repository’s stargazers count:
              <span className="font-mono text-cyan-300 ml-1">Radius = 1.0 + log10(Stars + 1) × 0.55</span>.
              This ensures every project remains visible while giving popular repositories majestic gravitational presence.
            </p>
          </div>

          {/* Mapping 2: Orbital Arrangement */}
          <div>
            <div className="flex items-center gap-2 text-white font-semibold font-sans text-sm mb-2">
              <Disc className="w-4 h-4 text-cyan-400" />
              <span>Orbital Trajectories</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Repositories are distributed across concentric orbital paths using the golden ratio spiral angle (~137.5°). Inner orbits feature the most prominent repositories, rotating with Keplerian orbital velocities.
            </p>
          </div>

          {/* Mapping 3: Planetary Archetypes */}
          <div>
            <div className="flex items-center gap-2 text-white font-semibold font-sans text-sm mb-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Planetary Archetypes</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {[
                { name: 'Terrestrial', desc: 'Cratered rocky crust (C, Shell)' },
                { name: 'Gas Giant', desc: 'Atmospheric swirl bands (JS, Java)' },
                { name: 'Ice World', desc: 'Glacial fissures (TypeScript, Go)' },
                { name: 'Ringed World', desc: 'Saturnian accretion rings (>5k stars)' },
                { name: 'Oceanic', desc: 'Bioluminescent coasts (Python, Dart)' },
                { name: 'Volcanic', desc: 'Lava fissures & magma (Rust, HTML)' },
              ].map(arch => (
                <div key={arch.name} className="p-2 rounded-lg bg-slate-900/60 border border-white/5">
                  <div className="font-mono text-[11px] text-cyan-300 font-semibold">{arch.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{arch.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mapping 4: Moons & Constellations */}
          <div>
            <div className="flex items-center gap-2 text-white font-semibold font-sans text-sm mb-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Moons & Constellation Lines</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Forks generate natural satellites (moons) orbiting each planet. Luminous constellation lines connect repositories that share primary languages or GitHub topic tags.
            </p>
          </div>

          {/* Mapping 5: Language Spectrum */}
          <div>
            <div className="text-white font-semibold font-sans text-sm mb-2">
              Dominant Language Spectrum in this Universe
            </div>
            <div className="space-y-1.5">
              {languageStats.map(lang => (
                <div key={lang.name} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/50 border border-white/5 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: lang.color }} 
                    />
                    <span className="text-white">{lang.name}</span>
                  </div>
                  <div className="text-slate-400">
                    <span>{lang.count} repos</span>
                    <span className="text-cyan-400 ml-2">({lang.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
