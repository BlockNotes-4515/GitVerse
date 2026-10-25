import React from 'react';
import { X, Orbit, GitFork, Disc, Sparkles } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl border border-white/15 bg-[#070b14]/98 shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <Orbit className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold font-sans text-white">How GitVerse Works</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-6 text-xs text-slate-300">
          <div className="flex gap-4">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0">
              01
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Public Signal Acquisition
              </h3>
              <p className="text-slate-400 leading-relaxed">
                When you enter a GitHub username, GitVerse queries the official GitHub REST API (<code className="text-cyan-300">/users/:username</code> and <code className="text-cyan-300">/users/:username/repos</code>) for public profile statistics and cataloged repositories. No authentication or login is required.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0">
              02
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Central Developer Core (The Star)
              </h3>
              <p className="text-slate-400 leading-relaxed">
                The developer becomes the radiant star at the center of the universe. Its coronal color temperature, solar flare loops, and stellar classification (e.g. Class-O Hypergiant Luminary) are forged from the developer’s repository volume, total stargazers, and primary coding language.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0">
              03
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1">
                Planetary Repository Synthesis
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Each repository is mapped to an explorable 3D planet:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
                <li><strong className="text-white">Radius:</strong> Scaled logarithmically by stars (<code className="text-cyan-300">1.0 + log10(Stars + 1) × 0.55</code>).</li>
                <li><strong className="text-white">Color:</strong> Determined by the primary programming language.</li>
                <li><strong className="text-white">Archetype:</strong> Terrestrial rock, gas giant, ice world, ringed world, volcanic, or oceanic, generated via deterministic procedural 2D canvases.</li>
                <li><strong className="text-white">Moons:</strong> Generated from repository fork traction.</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono font-bold flex items-center justify-center shrink-0">
              04
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                <GitFork className="w-4 h-4 text-cyan-400" />
                Dual Exploration Modes
              </h3>
              <p className="text-slate-400 leading-relaxed">
                Switch seamlessly between <strong className="text-cyan-300">Galaxy Mode</strong> (a Keplerian orbital planetary solar system with celestial inclinations) and <strong className="text-cyan-300">Tree Mode</strong> (a 3D branching phylogenetic tree grouping repositories by linguistic branches).
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
          >
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
};
