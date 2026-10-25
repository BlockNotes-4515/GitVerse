import React, { useState } from 'react';
import { 
  Orbit, 
  GitFork, 
  RotateCcw, 
  Search, 
  Share2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Sliders,
  X
} from 'lucide-react';
import { ViewMode } from '../../types';

interface ControlDockProps {
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedLanguage: string | null;
  onLanguageChange: (lang: string | null) => void;
  availableLanguages: string[];
  onResetCamera: () => void;
  onOpenLegend: () => void;
  onOpenShare: () => void;
  motionIntensity: number;
  onChangeMotionIntensity: (val: number) => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  viewMode,
  onToggleViewMode,
  searchQuery,
  onSearchChange,
  selectedLanguage,
  onLanguageChange,
  availableLanguages,
  onResetCamera,
  onOpenLegend,
  onOpenShare,
  motionIntensity,
  onChangeMotionIntensity,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSpeedSlider, setShowSpeedSlider] = useState(false);

  return (
    <div 
      className="fixed z-30 transition-all duration-300 ease-in-out pointer-events-auto"
      style={{
        bottom: isCollapsed ? '-80px' : '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 'min(960px, 94vw)',
        width: 'max-content',
      }}
    >
      {/* Collapse/Expand Toggle Tab */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-3 py-1 rounded-t-lg bg-[#070b14]/90 border-t border-x border-white/15 text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer shadow-lg"
          title={isCollapsed ? 'Show Controls Dock' : 'Hide Controls Dock (Zen View)'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>SHOW CONTROLS</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>HIDE CONTROLS</span>
            </>
          )}
        </button>
      </div>

      {/* Main Unified Dock Container */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl border border-white/15 bg-[#070b14]/95 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md">
        {/* Mode Switcher: Galaxy vs Tree */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-900/90 border border-white/10 shrink-0">
          <button
            onClick={() => onToggleViewMode('galaxy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              viewMode === 'galaxy'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>Galaxy Mode</span>
          </button>
          <button
            onClick={() => onToggleViewMode('tree')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium font-sans flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              viewMode === 'tree'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Tree Mode</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center rounded-xl bg-slate-900/80 border border-white/10 px-2.5 py-1.5 min-w-[150px] sm:min-w-[190px] flex-1 sm:flex-initial">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search planets..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-slate-400 hover:text-white ml-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Language Filter Dropdown */}
        <div className="shrink-0">
          <select
            value={selectedLanguage || 'ALL'}
            onChange={(e) => onLanguageChange(e.target.value === 'ALL' ? null : e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-sans text-slate-300 hover:text-white outline-none cursor-pointer"
          >
            <option value="ALL">All Languages</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-5 bg-white/10 mx-0.5" />

        {/* Speed Slider Popover Toggle */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowSpeedSlider(!showSpeedSlider)}
            className={`p-1.5 rounded-xl border text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer ${
              showSpeedSlider || motionIntensity !== 1.0
                ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300'
                : 'border-white/10 bg-slate-900/80 text-slate-400 hover:text-white'
            }`}
            title="Adjust Orbit Speed / Motion"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">{motionIntensity.toFixed(1)}x</span>
          </button>

          {showSpeedSlider && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-3 rounded-xl bg-[#090d19] border border-white/15 shadow-2xl flex flex-col gap-2 min-w-[140px]">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>SPEED</span>
                <span className="text-cyan-400">{motionIntensity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.1"
                value={motionIntensity}
                onChange={(e) => onChangeMotionIntensity(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <button onClick={() => onChangeMotionIntensity(0)} className="hover:text-white">PAUSE</button>
                <button onClick={() => onChangeMotionIntensity(1.0)} className="hover:text-white">1.0x</button>
                <button onClick={() => onChangeMotionIntensity(2.0)} className="hover:text-white">2.0x</button>
              </div>
            </div>
          )}
        </div>

        {/* Camera Reset */}
        <button
          onClick={onResetCamera}
          className="p-1.5 rounded-xl border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center gap-1 text-xs shrink-0"
          title="Reset Camera Position"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">RESET</span>
        </button>

        {/* Cosmic Legend */}
        <button
          onClick={onOpenLegend}
          className="p-1.5 rounded-xl border border-white/10 bg-slate-900/80 text-slate-400 hover:text-white hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center gap-1 text-xs shrink-0"
          title="Visualization Legend"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">LEGEND</span>
        </button>

        {/* Share Button */}
        <button
          onClick={onOpenShare}
          className="px-3 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] shrink-0 cursor-pointer"
          title="Export Share Card"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>SHARE</span>
        </button>
      </div>
    </div>
  );
};
