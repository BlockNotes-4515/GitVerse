import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { UniverseData, PlanetNode, ViewMode } from '../../types';
import { createStarfield, createNebulaClouds } from './Starfield';
import { createCentralStar, CentralStarObject } from './CentralStar';
import { createPlanetObject, PlanetObject } from './PlanetObject';
import { createConstellations, ConstellationSystem } from './Constellations';
import { cosmicAudio } from '../../services/audio';

interface CosmicSceneProps {
  universe: UniverseData;
  viewMode: ViewMode;
  selectedPlanet: PlanetNode | null;
  searchQuery: string;
  selectedLanguage: string | null;
  onSelectPlanet: (planet: PlanetNode | null) => void;
  onHoverPlanet?: (planet: PlanetNode | null) => void;
  onResetCameraTrigger?: number;
  motionIntensity?: number;
}

export const CosmicScene: React.FC<CosmicSceneProps> = ({
  universe,
  viewMode,
  selectedPlanet,
  searchQuery,
  selectedLanguage,
  onSelectPlanet,
  onHoverPlanet,
  onResetCameraTrigger,
  motionIntensity = 1.0,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Keep refs for active Three.js state across React updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const planetObjectsRef = useRef<PlanetObject[]>([]);
  const centralStarRef = useRef<CentralStarObject | null>(null);
  const constellationsRef = useRef<ConstellationSystem | null>(null);

  // Camera target interpolation state
  const cameraTargetPos = useRef(new THREE.Vector3(0, 45, 95));
  const controlsTargetLook = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioningCamera = useRef(false);

  // Mode lerp state (0 = galaxy, 1 = tree)
  const modeLerp = useRef(viewMode === 'tree' ? 1.0 : 0.0);

  // Software WebGL detection
  const isSoftwareGlRef = useRef(false);

  // Reusable raycasting vectors (Zero GC)
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2(-999, -999));
  const hoveredPlanetRef = useRef<PlanetObject | null>(null);

  // 1. Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();
    isSoftwareGlRef.current = isSoftwareGl;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030408');
    scene.fog = new THREE.FogExp2('#030408', 0.0035);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.5,
      2000
    );
    camera.position.set(0, 52, 105);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Studio Environment map via PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 280;
    controls.minDistance = 6;
    controls.maxPolarAngle = Math.PI * 0.88;
    controls.minPolarAngle = 0.05;
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      // User manual intervention pauses scripted transition
      isTransitioningCamera.current = false;
    });

    // Ambient Hemisphere Lighting
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.45);
    scene.add(hemiLight);

    // Key directional light for soft planet shadows
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(40, 80, 50);
    dirLight.castShadow = !isSoftwareGl;
    scene.add(dirLight);

    // Stars & Deep Space Nebulae
    const starfield = createStarfield(isSoftwareGl ? 1200 : 2800);
    scene.add(starfield);

    const nebulae = createNebulaClouds();
    scene.add(nebulae);

    // Central Star (Developer Sun)
    const centralStar = createCentralStar(universe.stellarColor);
    scene.add(centralStar.group);
    centralStarRef.current = centralStar;

    // Planets
    const planetObjects: PlanetObject[] = [];
    universe.planets.forEach(pNode => {
      const pObj = createPlanetObject(pNode, isSoftwareGl);
      scene.add(pObj.group);
      scene.add(pObj.orbitLine);
      planetObjects.push(pObj);
    });
    planetObjectsRef.current = planetObjects;

    // Constellations
    const constellations = createConstellations(planetObjects);
    scene.add(constellations.linesGroup);
    scene.add(constellations.treeLinesGroup);
    constellationsRef.current = constellations;

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime() * motionIntensity;

      // Update central star
      centralStar.update(time);

      // Smooth ViewMode interpolation (galaxy vs tree)
      const targetModeLerp = viewMode === 'tree' ? 1.0 : 0.0;
      modeLerp.current = THREE.MathUtils.damp(modeLerp.current, targetModeLerp, 4.0, delta);

      // Update planets
      planetObjects.forEach(p => {
        p.update(time, modeLerp.current, isSoftwareGl);
      });

      // Update constellations
      constellations.update(time, modeLerp.current);

      // Smooth camera choreography towards focused target
      if (isTransitioningCamera.current) {
        camera.position.lerp(cameraTargetPos.current, 0.045);
        controls.target.lerp(controlsTargetLook.current, 0.05);

        if (camera.position.distanceTo(cameraTargetPos.current) < 0.5) {
          isTransitioningCamera.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    renderLoop();

    // Resize Handler
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Pointer Move for Hover & Raycasting
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!camera) return;
      raycaster.current.setFromCamera(mouse.current, camera);

      // Check intersect with planet body meshes
      const bodyMeshes = planetObjects.map(p => p.bodyMesh);
      const intersects = raycaster.current.intersectObjects(bodyMeshes, false);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const matched = planetObjects.find(p => p.bodyMesh === hitMesh);
        if (matched && matched !== hoveredPlanetRef.current) {
          hoveredPlanetRef.current?.setHovered(false);
          matched.setHovered(true);
          hoveredPlanetRef.current = matched;
          onHoverPlanet?.(matched.node);
          container.style.cursor = 'pointer';
          cosmicAudio.playHoverTone(280 + matched.node.radius * 60);
        }
      } else {
        if (hoveredPlanetRef.current) {
          hoveredPlanetRef.current.setHovered(false);
          hoveredPlanetRef.current = null;
          onHoverPlanet?.(null);
          container.style.cursor = 'grab';
        }
      }
    };

    // Click on Planet to Focus
    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!camera) return;
      raycaster.current.setFromCamera(mouse.current, camera);

      const bodyMeshes = planetObjects.map(p => p.bodyMesh);
      // Also include central star core
      const hits = raycaster.current.intersectObjects([...bodyMeshes, centralStar.coreMesh], false);

      if (hits.length > 0) {
        const firstHit = hits[0].object;
        if (firstHit === centralStar.coreMesh) {
          // Central star clicked -> focus on root star
          onSelectPlanet(null);
          cameraTargetPos.current.set(0, 14, 28);
          controlsTargetLook.current.set(0, 0, 0);
          isTransitioningCamera.current = true;
          cosmicAudio.playSelectChime();
          return;
        }

        const matched = planetObjects.find(p => p.bodyMesh === firstHit);
        if (matched) {
          onSelectPlanet(matched.node);
          cosmicAudio.playSelectChime();
        }
      }
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('click', handleClick);

      starfield.geometry.dispose();
      (starfield.material as THREE.Material).dispose();

      centralStar.dispose();
      planetObjects.forEach(p => p.dispose());
      constellations.dispose();

      controls.dispose();
      renderer.dispose();
    };
  }, [universe]);

  // Handle Selected Planet changes & camera glide
  useEffect(() => {
    planetObjectsRef.current.forEach(p => {
      p.setSelected(p.node.id === selectedPlanet?.id);
    });

    if (selectedPlanet) {
      const pObj = planetObjectsRef.current.find(p => p.node.id === selectedPlanet.id);
      if (pObj && cameraRef.current && controlsRef.current) {
        const worldPos = new THREE.Vector3();
        pObj.group.getWorldPosition(worldPos);

        controlsTargetLook.current.copy(worldPos);
        // Position camera offset to view the planet heroically
        const offset = new THREE.Vector3(
          selectedPlanet.radius * 2.2,
          selectedPlanet.radius * 1.4,
          selectedPlanet.radius * 3.4
        );
        cameraTargetPos.current.copy(worldPos).add(offset);
        isTransitioningCamera.current = true;
      }
    }
  }, [selectedPlanet]);

  // Handle Reset Camera action
  useEffect(() => {
    if (onResetCameraTrigger && onResetCameraTrigger > 0) {
      cameraTargetPos.current.set(0, 52, 105);
      controlsTargetLook.current.set(0, 0, 0);
      isTransitioningCamera.current = true;
      onSelectPlanet(null);
    }
  }, [onResetCameraTrigger]);

  // Handle Search and Language Filtering (Dim non-matching planets)
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    planetObjectsRef.current.forEach(p => {
      let matches = true;

      if (query) {
        const nameMatch = p.node.repo.name.toLowerCase().includes(query);
        const descMatch = (p.node.repo.description || '').toLowerCase().includes(query);
        const langMatch = (p.node.repo.language || '').toLowerCase().includes(query);
        const topicMatch = p.node.repo.topics?.some(t => t.toLowerCase().includes(query));
        if (!nameMatch && !descMatch && !langMatch && !topicMatch) {
          matches = false;
        }
      }

      if (selectedLanguage && selectedLanguage !== 'ALL') {
        if (p.node.repo.language !== selectedLanguage) {
          matches = false;
        }
      }

      p.setDimmed(!matches);
    });
  }, [searchQuery, selectedLanguage]);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full overflow-hidden select-none outline-none"
      style={{ touchAction: 'none' }}
    />
  );
};
