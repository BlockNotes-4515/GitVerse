import React from 'react';
import { X, Sparkles, Code2, Globe2, Cpu, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-2xl p-6 sm:p-8 rounded-2xl border border-white/15 bg-[#070b14]/98 shadow-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold font-sans text-white">About GitVerse</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
          <div>
            <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              The Creative Vision
            </h3>
            <p className="text-slate-400">
              GitVerse is an original creative technology experience that transforms software engineering into an explorable digital cosmos. Built with the belief that open-source code represents human civilization’s greatest collaborative endeavor, GitVerse turns abstract git trees into living solar systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <div className="flex items-center gap-2 text-white font-semibold mb-1">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Deterministic Math</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Every planet, orbit, texture, and archetype is derived deterministically from the user’s real GitHub metadata. The same repository always generates the exact same celestial world.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5">
              <div className="flex items-center gap-2 text-white font-semibold mb-1">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Zero-Asset Architecture</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                100% of textures, normal maps, starfields, and ambient soundscapes are procedurally generated in code using HTML5 2D Canvas and Web Audio API. Zero external 404 dependencies.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-1.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Privacy & Verification
            </h3>
            <p className="text-slate-400">
              GitVerse only queries publicly accessible GitHub endpoints without requiring OAuth tokens or user permissions. We do not store, track, or sell your data. Only verified public telemetry is presented.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
