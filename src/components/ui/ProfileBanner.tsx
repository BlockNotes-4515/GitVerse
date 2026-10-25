import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ExternalLink, 
  Star, 
  GitFork, 
  Users, 
  BookOpen,
  MapPin,
  Building
} from 'lucide-react';
import { UniverseData } from '../../types';

interface ProfileBannerProps {
  universe: UniverseData;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({ universe }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const user = universe.user;

  return (
    <div className="fixed top-20 left-4 sm:left-6 z-30 w-[calc(100vw-32px)] sm:w-80 transition-all duration-300 pointer-events-auto">
      <div className="p-4 rounded-2xl border border-white/15 bg-[#070b14]/95 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md">
        {/* Profile Card Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-12 h-12 rounded-xl border border-cyan-400/40 object-cover shadow-sm bg-slate-900"
              referrerPolicy="no-referrer"
            />
            <div>
              <h2 className="text-sm font-bold font-sans text-white leading-tight">
                {user.name || user.login}
              </h2>
              <a
                href={user.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                <span>@{user.login}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand profile' : 'Collapse profile'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Collapsible Details */}
        {!isCollapsed && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
            {/* Bio */}
            {user.bio && (
              <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-2">
                {user.bio}
              </p>
            )}

            {/* Location & Company */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{user.location}</span>
                </span>
              )}
              {user.company && (
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{user.company}</span>
                </span>
              )}
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-4 gap-1 p-2 rounded-xl bg-slate-900/80 border border-white/10 text-center">
              <div>
                <div className="flex items-center justify-center gap-0.5 text-[11px] font-mono text-white font-bold">
                  <BookOpen className="w-3 h-3 text-cyan-400" />
                  <span>{user.public_repos}</span>
                </div>
                <div className="text-[9px] text-slate-400">Repos</div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-0.5 text-[11px] font-mono text-amber-300 font-bold">
                  <Star className="w-3 h-3 fill-amber-300" />
                  <span>
                    {universe.totalStars > 999 
                      ? `${(universe.totalStars / 1000).toFixed(1)}k` 
                      : universe.totalStars}
                  </span>
                </div>
                <div className="text-[9px] text-slate-400">Stars</div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-0.5 text-[11px] font-mono text-sky-400 font-bold">
                  <GitFork className="w-3 h-3" />
                  <span>
                    {universe.totalForks > 999 
                      ? `${(universe.totalForks / 1000).toFixed(1)}k` 
                      : universe.totalForks}
                  </span>
                </div>
                <div className="text-[9px] text-slate-400">Forks</div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-0.5 text-[11px] font-mono text-purple-300 font-bold">
                  <Users className="w-3 h-3" />
                  <span>
                    {user.followers > 999 
                      ? `${(user.followers / 1000).toFixed(1)}k` 
                      : user.followers}
                  </span>
                </div>
                <div className="text-[9px] text-slate-400">Followers</div>
              </div>
            </div>

            {/* Classification Badge */}
            <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
              <span>STELLAR CORE:</span>
              <span className="text-cyan-400 font-semibold">{universe.classification}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
