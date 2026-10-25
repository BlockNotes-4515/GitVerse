import React, { useState } from 'react';
import { ArrowRight, Search, Sparkles, AlertCircle } from 'lucide-react';
import { validateGitHubUsername } from '../../services/github';

interface HeroLandingProps {
  onGenerate: (username: string) => void;
  onExploreDemo: (username?: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
  onClearError: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onGenerate,
  onExploreDemo,
  isLoading,
  errorMessage,
  onClearError,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();
    const validation = validateGitHubUsername(usernameInput);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid username');
      return;
    }
    setValidationError(null);
    onGenerate(usernameInput.trim());
  };

  const handleDemoSelect = (user: string) => {
    setUsernameInput(user);
    setValidationError(null);
    onClearError();
    onGenerate(user);
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-center min-h-[92vh] px-4 sm:px-6 max-w-4xl mx-auto text-center pointer-events-auto">
      {/* Decorative Brand Eyebrow */}
      <div className="inline-flex items-center gap-2.5 px-3 py-1 mb-8 rounded-full border border-cyan-500/20 bg-cyan-950/20 text-cyan-400 text-xs font-mono uppercase tracking-widest backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        <span>GITVERSE 3D ENGINE</span>
        <span className="text-white/30">·</span>
        <span className="text-slate-300">ASTRONOMICAL CODE VISUALIZATION</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-sans max-w-3xl leading-[1.08] text-balance mb-6">
        YOUR CODE HAS A <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">UNIVERSE</span>.
      </h1>

      {/* Hero Subtitle */}
      <p className="text-base sm:text-xl text-slate-300 max-w-xl mx-auto leading-relaxed mb-10 text-balance font-light">
        Every repository tells a story. Explore yours in three dimensions.
      </p>

      {/* Main Integrated GitHub Username Input Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto mb-6">
        <div className="relative flex flex-col sm:flex-row items-stretch gap-2 p-1.5 rounded-xl border border-white/15 bg-[#070b14]/90 backdrop-blur-md shadow-2xl focus-within:border-cyan-400/80 transition-all">
          <div className="flex items-center gap-3 px-3.5 py-2.5 sm:py-0 flex-1">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => {
                setUsernameInput(e.target.value);
                if (validationError) setValidationError(null);
                if (errorMessage) onClearError();
              }}
              placeholder="Enter a GitHub username"
              disabled={isLoading}
              className="w-full bg-transparent text-white placeholder-slate-400 text-sm sm:text-base outline-none font-mono"
              autoFocus
              spellCheck={false}
              autoCapitalize="none"
              autoComplete="off"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !usernameInput.trim()}
            className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 disabled:pointer-events-none rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <span>{isLoading ? 'ACQUIRING SIGNAL...' : 'GENERATE MY UNIVERSE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Error Notification */}
        {(validationError || errorMessage) && (
          <div className="mt-3 p-3 rounded-lg bg-red-950/60 border border-red-500/30 text-red-200 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="flex-1">{validationError || errorMessage}</span>
          </div>
        )}
      </form>

      {/* Secondary Action: Demo Universes */}
      <div className="flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-400">
        <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
          Or explore verified cosmos:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['antfu', 'shadcn', 'torvalds', 'octocat'].map((demoUser) => (
            <button
              key={demoUser}
              onClick={() => handleDemoSelect(demoUser)}
              className="px-2.5 py-1 rounded-md border border-white/10 bg-white/[0.04] hover:bg-cyan-500/10 hover:border-cyan-500/40 hover:text-cyan-300 text-slate-300 font-mono text-xs transition-colors"
            >
              @{demoUser}
            </button>
          ))}
          <button
            onClick={() => onExploreDemo()}
            className="px-3 py-1 rounded-md text-cyan-400 hover:text-cyan-300 font-medium text-xs underline underline-offset-4 transition-colors"
          >
            Random Demo →
          </button>
        </div>
      </div>

      {/* Visual Metadata Badges */}
      <div className="mt-14 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg border-t border-white/[0.08] pt-6 text-center">
        <div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">3D</div>
          <div className="text-[11px] text-slate-400 font-sans mt-0.5">Procedural Orbits</div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">100%</div>
          <div className="text-[11px] text-slate-400 font-sans mt-0.5">Public GitHub Data</div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-white">Dual</div>
          <div className="text-[11px] text-slate-400 font-sans mt-0.5">Galaxy & Tree Modes</div>
        </div>
      </div>
    </div>
  );
};
