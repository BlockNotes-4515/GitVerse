import React from 'react';
import { Github, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 py-8 px-6 border-t border-white/[0.08] bg-[#030408]/90 text-xs text-slate-400">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: Brand & Statement */}
        <div className="flex items-center gap-3">
          <span className="font-bold tracking-tight text-white font-sans">GITVERSE</span>
          <span className="text-white/20">·</span>
          <span>The Interactive 3D Universe of Code</span>
        </div>

        {/* Center: Tech Attribution */}
        <div className="text-[11px] font-mono text-slate-400">
          Powered by Three.js & GitHub REST API · Zero External Assets
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-4 text-slate-400">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <a
            href="https://threejs.org"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Three.js</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
