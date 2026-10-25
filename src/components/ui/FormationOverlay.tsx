import React, { useEffect, useState } from 'react';
import { FastForward, Radio, Orbit, Globe, Sparkles } from 'lucide-react';
import { FormationStage } from '../../types';

interface FormationOverlayProps {
  username: string;
  stage: FormationStage;
  stageMessage?: string;
  onSkip: () => void;
}

export const FormationOverlay: React.FC<FormationOverlayProps> = ({
  username,
  stage,
  stageMessage,
  onSkip,
}) => {
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    switch (stage) {
      case 'signal_acquisition':
        setProgress(28);
        break;
      case 'stellar_formation':
        setProgress(54);
        break;
      case 'planetary_emergence':
        setProgress(76);
        break;
      case 'orbital_stabilization':
        setProgress(92);
        break;
      case 'ready':
        setProgress(100);
        break;
      default:
        setProgress(15);
    }
  }, [stage]);

  const stagesList = [
    { id: 'signal_acquisition', label: 'Signal Acquisition', icon: Radio },
    { id: 'stellar_formation', label: 'Stellar Formation', icon: Sparkles },
    { id: 'planetary_emergence', label: 'Planetary Emergence', icon: Globe },
    { id: 'orbital_stabilization', label: 'Orbital Stabilization', icon: Orbit },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030408]/85 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl border border-cyan-500/30 bg-[#070b14]/95 shadow-[0_0_60px_rgba(6,182,212,0.15)] text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header telemetry */}
        <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>FORMATION SEQUENCE IN PROGRESS</span>
          </div>
          <button
            onClick={onSkip}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer text-[11px]"
          >
            <span>SKIP SEQUENCE</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Target Username */}
        <h2 className="text-2xl sm:text-3xl font-bold font-sans text-white mb-2">
          Constructing Universe for <span className="text-cyan-400">@{username}</span>
        </h2>

        {/* Active Stage Subtitle */}
        <p className="text-sm font-mono text-slate-300 min-h-[24px] mb-8">
          {stageMessage || 'Initializing astronomical simulation...'}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-8 relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Sequence Milestones */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {stagesList.map((s, idx) => {
            const IconComponent = s.icon;
            const stageIndex = stagesList.findIndex(item => item.id === stage);
            const isCompleted = stageIndex > idx || stage === 'ready';
            const isCurrent = stage === s.id;

            return (
              <div
                key={s.id}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? 'border-cyan-400 bg-cyan-950/30 text-white'
                    : isCompleted
                    ? 'border-white/10 bg-white/[0.02] text-slate-300'
                    : 'border-white/5 bg-transparent text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <IconComponent
                    className={`w-4 h-4 ${
                      isCurrent
                        ? 'text-cyan-400 animate-bounce'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span className="font-mono text-[10px] text-slate-400">0{idx + 1}</span>
                </div>
                <div className="text-[11px] font-sans font-medium leading-tight">
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
