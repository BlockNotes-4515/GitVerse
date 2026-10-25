import React, { useEffect, useState } from 'react';
import { X, Download, Copy, Check, Share2, Sparkles, Loader2 } from 'lucide-react';
import { UniverseData } from '../../types';
import { generateShareCard, downloadDataUrl } from '../../services/shareCard';

interface ShareModalProps {
  universe: UniverseData;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ universe, onClose }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?u=${universe.user.login}`
    : `https://gitverse.dev/u/${universe.user.login}`;

  useEffect(() => {
    let isMounted = true;
    generateShareCard(universe)
      .then((dataUrl) => {
        if (isMounted) {
          setImageUrl(dataUrl);
          setIsGenerating(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [universe]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      downloadDataUrl(imageUrl, `gitverse-${universe.user.login}.png`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-2xl p-6 sm:p-7 rounded-2xl border border-cyan-500/30 bg-[#070b14]/98 shadow-[0_0_60px_rgba(6,182,212,0.2)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold font-sans text-white">
              Share @{universe.user.login}’s Universe
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Card Image Preview */}
        <div className="relative rounded-xl border border-white/15 overflow-hidden bg-black/60 aspect-[1200/630] mb-5 flex items-center justify-center">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-2 text-cyan-400 text-xs font-mono">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Synthesizing cosmic social card...</span>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={`GitVerse universe of @${universe.user.login}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-xs text-slate-400">Card generation failed. Use the direct link below.</div>
          )}
        </div>

        {/* Shareable Link Bar */}
        <div className="mb-6">
          <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
            Cosmic Coordinates Link
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-white/10">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent px-2 text-xs font-mono text-cyan-300 outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-950" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>High-res PNG with verified GitHub telemetry</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              disabled={isGenerating || !imageUrl}
              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-200 text-xs font-semibold font-mono flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>DOWNLOAD PNG CARD</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
