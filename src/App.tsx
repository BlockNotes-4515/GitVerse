/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { UniverseData, PlanetNode, ViewMode, FormationStage } from './types';
import { fetchGitHubUniverse, buildUniverseData } from './services/github';
import { DEMO_PROFILES } from './constants/demoProfiles';
import { cosmicAudio } from './services/audio';

import { CosmicScene } from './components/3d/CosmicScene';
import { TopNav } from './components/ui/TopNav';
import { HeroLanding } from './components/ui/HeroLanding';
import { FormationOverlay } from './components/ui/FormationOverlay';
import { ProfileBanner } from './components/ui/ProfileBanner';
import { ControlDock } from './components/ui/ControlDock';
import { RepoInspector } from './components/ui/RepoInspector';
import { UniverseLegend } from './components/ui/UniverseLegend';
import { ShareModal } from './components/ui/ShareModal';
import { HowItWorksModal } from './components/ui/HowItWorksModal';
import { AboutModal } from './components/ui/AboutModal';
import { Footer } from './components/ui/Footer';

export default function App() {
  const [universe, setUniverse] = useState<UniverseData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formationStage, setFormationStage] = useState<FormationStage>('idle');
  const [formationMessage, setFormationMessage] = useState<string>('');
  const [pendingUsername, setPendingUsername] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3D & Exploration controls
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetNode | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('galaxy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [motionIntensity, setMotionIntensity] = useState(1.0);
  const [resetCameraCount, setResetCameraCount] = useState(0);

  // Audio & Modals
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Parse username from URL route: /u/:username or ?u=:username
  const getUsernameFromLocation = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    const queryUser = urlParams.get('u');
    if (queryUser) return queryUser;

    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2 && pathParts[0] === 'u') {
      return pathParts[1];
    }
    return null;
  }, []);

  // Primary Universe Generation Workflow
  const handleGenerateUniverse = useCallback(async (username: string, skipAnimation = false) => {
    const clean = username.trim().toLowerCase();
    if (!clean) return;

    setPendingUsername(clean);
    setIsLoading(true);
    setErrorMessage(null);
    setSelectedPlanet(null);

    // URL sync
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?u=${clean}`;
      window.history.pushState({ username: clean }, '', newUrl);
    }

    if (!skipAnimation) {
      setFormationStage('signal_acquisition');
      setFormationMessage(`Acquiring public telemetry for @${clean}...`);
      cosmicAudio.playWarpTransition();
    }

    try {
      // Step 1: Signal Acquisition
      const result = await fetchGitHubUniverse(clean, (msg) => {
        setFormationMessage(msg);
      });

      if (result.error || !result.data) {
        setIsLoading(false);
        setFormationStage('idle');
        setErrorMessage(result.error || 'Failed to acquire universe signal.');
        return;
      }

      if (skipAnimation) {
        setUniverse(result.data);
        setIsLoading(false);
        setFormationStage('ready');
        return;
      }

      // Step 2: Stellar Formation
      setFormationStage('stellar_formation');
      setFormationMessage(`Forging developer star (${result.data.classification})...`);
      await new Promise(r => setTimeout(r, 650));

      // Step 3: Planetary Emergence
      setFormationStage('planetary_emergence');
      setFormationMessage(`Synthesizing ${result.data.planets.length} planetary repositories...`);
      await new Promise(r => setTimeout(r, 700));

      // Step 4: Orbital Stabilization
      setFormationStage('orbital_stabilization');
      setFormationMessage('Aligning gravitational orbits and constellation matrices...');
      await new Promise(r => setTimeout(r, 600));

      // Step 5: Universe Ready
      setUniverse(result.data);
      setFormationStage('ready');
      setIsLoading(false);
      cosmicAudio.playSelectChime();
    } catch (err) {
      setIsLoading(false);
      setFormationStage('idle');
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  }, []);

  // Demo Universe selection
  const handleExploreDemo = useCallback((demoUser?: string) => {
    const demoKeys = Object.keys(DEMO_PROFILES);
    const chosen = demoUser || demoKeys[Math.floor(Math.random() * demoKeys.length)];
    handleGenerateUniverse(chosen);
  }, [handleGenerateUniverse]);

  // Handle URL change on first load and back/forward navigation
  useEffect(() => {
    const initialUser = getUsernameFromLocation();
    if (initialUser) {
      handleGenerateUniverse(initialUser);
    }

    const handlePopState = () => {
      const user = getUsernameFromLocation();
      if (user) {
        handleGenerateUniverse(user, true);
      } else {
        setUniverse(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getUsernameFromLocation, handleGenerateUniverse]);

  // Audio Toggle
  const handleToggleAudio = () => {
    const isNowActive = cosmicAudio.toggleMute();
    setIsAudioMuted(!isNowActive);
  };

  // Reset Camera action
  const handleResetCamera = () => {
    setResetCameraCount(c => c + 1);
    setSelectedPlanet(null);
  };

  // Unique languages in current universe
  const availableLanguages = useMemo(() => {
    if (!universe) return [];
    return universe.languageBreakdown.map(l => l.name);
  }, [universe]);

  // Skip formation animation
  const handleSkipFormation = () => {
    if (pendingUsername && DEMO_PROFILES[pendingUsername]) {
      const demo = DEMO_PROFILES[pendingUsername];
      setUniverse(buildUniverseData(demo.user, demo.repos));
    }
    setIsLoading(false);
    setFormationStage('ready');
  };

  // Landing cosmos default universe (renders the subtle background cosmos)
  const backgroundUniverse = useMemo(() => {
    const defaultDemo = DEMO_PROFILES['octocat'];
    return buildUniverseData(defaultDemo.user, defaultDemo.repos);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030408] text-slate-100 font-sans select-none">
      {/* 1. 3D WebGL Canvas Layer (Fills entire screen) */}
      <CosmicScene
        universe={universe || backgroundUniverse}
        viewMode={viewMode}
        selectedPlanet={selectedPlanet}
        searchQuery={searchQuery}
        selectedLanguage={selectedLanguage}
        onSelectPlanet={setSelectedPlanet}
        onHoverPlanet={() => {}}
        onResetCameraTrigger={resetCameraCount}
        motionIntensity={motionIntensity}
      />

      {/* 2. Top Navigation Bar (Zone 1 - Zone 2 - Zone 3) */}
      <TopNav
        onNewUniverseClick={() => {
          setUniverse(null);
          setSelectedPlanet(null);
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', window.location.pathname);
          }
        }}
        onExploreDemoClick={() => handleExploreDemo()}
        onOpenHowItWorks={() => setShowHowItWorks(true)}
        onOpenAbout={() => setShowAbout(true)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        hasActiveUniverse={Boolean(universe)}
        currentUsername={universe?.user.login}
      />

      {/* 3. Hero Landing Screen (Shown when no universe is active) */}
      {!universe && !isLoading && (
        <div className="absolute inset-0 pt-16 overflow-y-auto flex flex-col justify-between">
          <HeroLanding
            onGenerate={handleGenerateUniverse}
            onExploreDemo={handleExploreDemo}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onClearError={() => setErrorMessage(null)}
          />
          <Footer />
        </div>
      )}

      {/* 4. Cinematic Formation Overlay Sequence */}
      {isLoading && (
        <FormationOverlay
          username={pendingUsername}
          stage={formationStage}
          stageMessage={formationMessage}
          onSkip={handleSkipFormation}
        />
      )}

      {/* 5. Active Universe HUD & Overlays */}
      {universe && !isLoading && (
        <>
          {/* Top-Left Developer Profile Banner */}
          <ProfileBanner universe={universe} />

          {/* Focused Planet Repository Inspector */}
          {selectedPlanet && (
            <RepoInspector
              planet={selectedPlanet}
              allPlanets={universe.planets}
              onClose={() => setSelectedPlanet(null)}
              onSelectPlanet={setSelectedPlanet}
            />
          )}

          {/* Unified Collapsible Bottom Dock */}
          <ControlDock
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            availableLanguages={availableLanguages}
            onResetCamera={handleResetCamera}
            onOpenLegend={() => setShowLegend(true)}
            onOpenShare={() => setShowShare(true)}
            motionIntensity={motionIntensity}
            onChangeMotionIntensity={setMotionIntensity}
          />
        </>
      )}

      {/* 6. Modals & Drawers */}
      {showLegend && universe && (
        <UniverseLegend
          languageStats={universe.languageBreakdown}
          onClose={() => setShowLegend(false)}
        />
      )}

      {showShare && universe && (
        <ShareModal
          universe={universe}
          onClose={() => setShowShare(false)}
        />
      )}

      {showHowItWorks && (
        <HowItWorksModal onClose={() => setShowHowItWorks(false)} />
      )}

      {showAbout && (
        <AboutModal onClose={() => setShowAbout(false)} />
      )}
    </div>
  );
}
