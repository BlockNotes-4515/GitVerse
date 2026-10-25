import React from 'react';
import { Volume2, VolumeX, Sparkles, Compass } from 'lucide-react';
import { cosmicAudio } from '../../services/audio';

interface TopNavProps {
  onNewUniverseClick: () => void;
  onExploreDemoClick: () => void;
  onOpenHowItWorks: () => void;
  onOpenAbout: () => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  hasActiveUniverse: boolean;
  currentUsername?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  onNewUniverseClick,
  onExploreDemoClick,
  onOpenHowItWorks,
  onOpenAbout,
  isAudioMuted,
  onToggleAudio,
  hasActiveUniverse,
  currentUsername,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between gap-8 px-6 py-4 border-b border-white/[0.08] bg-[#030408]/80 backdrop-blur-md transition-all">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNewUniverseClick}
          className="flex items-center gap-2.5 text-left group focus-visible:ring-1 focus-visible:ring-cyan-400 rounded-sm"
        >
          <div className="w-7 h-7 rounded-full border border-cyan-400/40 flex items-center justify-center bg-cyan-950/40 group-hover:border-cyan-400 transition-colors">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-sans uppercase">
            GITVERSE
          </span>
        </button>

        {hasActiveUniverse && currentUsername && (
          <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-cyan-400/80 border-l border-white/10 pl-3">
            <span>UNIVERSE:</span>
            <span className="text-white font-semibold">@{currentUsername}</span>
          </span>
        )}
      </div>

      {/* Zone 2: 4-5 concise single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
        <button
          onClick={onExploreDemoClick}
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Explore Cosmos</span>
        </button>
        <button
          onClick={onOpenHowItWorks}
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
        >
          How It Works
        </button>
        <button
          onClick={onOpenAbout}
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
        >
          About GitVerse
        </button>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0"
        >
          GitHub REST API
        </a>
      </nav>

      {/* Zone 3: 1 primary action area */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleAudio}
          title={isAudioMuted ? 'Enable Ambient Sound' : 'Mute Ambient Sound'}
          className="p-2 text-xs font-mono text-slate-300 hover:text-white rounded-lg border border-white/10 hover:border-cyan-500/40 bg-white/[0.03] transition-colors flex items-center gap-1.5"
        >
          {isAudioMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline text-[11px]">MUTED</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline text-[11px] text-cyan-400">AUDIO ON</span>
            </>
          )}
        </button>

        {hasActiveUniverse ? (
          <button
            onClick={onNewUniverseClick}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-[0_0_14px_rgba(6,182,212,0.3)] whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Search</span>
          </button>
        ) : (
          <button
            onClick={onExploreDemoClick}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-[0_0_14px_rgba(6,182,212,0.3)] whitespace-nowrap shrink-0"
          >
            Explore Demo
          </button>
        )}
      </div>
    </header>
  );
};
