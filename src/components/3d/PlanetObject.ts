import * as THREE from 'three';
import { PlanetNode } from '../../types';
import { getProceduralPlanetTexture, getProceduralRingTexture } from '../../utils/procedural';

export interface PlanetObject {
  node: PlanetNode;
  group: THREE.Group;
  bodyMesh: THREE.Mesh;
  haloMesh: THREE.Mesh;
  orbitLine: THREE.Line;
  labelSprite: THREE.Sprite;
  moonGroup: THREE.Group;
  ringMesh?: THREE.Mesh;
  update: (time: number, modeLerp: number, isSoftwareGl: boolean) => void;
  setHovered: (hovered: boolean) => void;
  setSelected: (selected: boolean) => void;
  setDimmed: (dimmed: boolean) => void;
  dispose: () => void;
}

export function createPlanetObject(
  node: PlanetNode, 
  isSoftwareGl: boolean = false
): PlanetObject {
  const group = new THREE.Group();
  group.name = `planet_${node.id}`;
  group.userData = { planetNode: node };

  // 1. Planetary Body Mesh
  const segments = isSoftwareGl ? 16 : 32;
  const bodyGeo = new THREE.SphereGeometry(node.radius, segments, segments);
  const texture = getProceduralPlanetTexture(node.archetype, node.color, node.secondaryColor);

  let roughness = 0.6;
  let metalness = 0.15;
  if (node.archetype === 'ice_world') {
    roughness = 0.25;
    metalness = 0.6;
  } else if (node.archetype === 'volcanic') {
    roughness = 0.85;
    metalness = 0.05;
  } else if (node.archetype === 'gas_giant') {
    roughness = 0.9;
    metalness = 0.0;
  }

  const bodyMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness,
    metalness,
    emissive: new THREE.Color(node.emissiveColor),
    emissiveIntensity: 0.18,
  });

  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.name = `body_${node.id}`;
  bodyMesh.castShadow = !isSoftwareGl;
  bodyMesh.receiveShadow = !isSoftwareGl;
  group.add(bodyMesh);

  // 2. Atmospheric Rim / Fresnel Glow Shell
  const haloGeo = new THREE.SphereGeometry(node.radius * 1.22, segments, segments);
  const haloMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(node.secondaryColor),
    transparent: true,
    opacity: 0.28,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.name = `halo_${node.id}`;
  group.add(haloMesh);

  // 3. Selection / Focus Ring
  const selectRingGeo = new THREE.RingGeometry(node.radius * 1.45, node.radius * 1.55, 32);
  const selectRingMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const selectRingMesh = new THREE.Mesh(selectRingGeo, selectRingMat);
  selectRingMesh.rotation.x = Math.PI / 2;
  group.add(selectRingMesh);

  // 4. Planetary Rings (if archetype is ringed)
  let ringMesh: THREE.Mesh | undefined;
  let ringGeo: THREE.RingGeometry | undefined;
  let ringMat: THREE.MeshBasicMaterial | undefined;
  if (node.hasRings) {
    const innerR = node.radius * 1.6;
    const outerR = node.radius * 2.8;
    ringGeo = new THREE.RingGeometry(innerR, outerR, 48);
    const ringTex = getProceduralRingTexture(node.color);
    ringMat = new THREE.MeshBasicMaterial({
      map: ringTex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.45;
    ringMesh.rotation.y = 0.2;
    group.add(ringMesh);
  }

  // 5. Moons
  const moonGroup = new THREE.Group();
  group.add(moonGroup);
  const moonMeshes: { mesh: THREE.Mesh; dist: number; speed: number; angle: number }[] = [];

  for (let m = 0; m < node.moonCount; m++) {
    const moonGeo = new THREE.SphereGeometry(node.radius * 0.24, 12, 12);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.8,
      metalness: 0.1,
    });
    const mMesh = new THREE.Mesh(moonGeo, moonMat);
    const dist = node.radius * 2.3 + m * (node.radius * 1.2);
    const speed = 1.2 / Math.sqrt(dist);
    const angle = (m * Math.PI) / 1.5;
    mMesh.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
    moonGroup.add(mMesh);
    moonMeshes.push({ mesh: mMesh, dist, speed, angle });
  }

  // 6. Orbital Line in Galaxy Mode
  const orbitCurve = new THREE.EllipseCurve(
    0, 0,
    node.orbitRadius, node.orbitRadius,
    0, 2 * Math.PI,
    false,
    0
  );
  const orbitPoints = orbitCurve.getPoints(90);
  const orbitGeo = new THREE.BufferGeometry().setFromPoints(
    orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y))
  );
  const orbitMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(node.color),
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
  });
  const orbitLine = new THREE.Line(orbitGeo, orbitMat);
  orbitLine.rotation.x = node.orbitalTilt;

  // 7. Text Label Sprite (Billboarded)
  const labelCanvas = document.createElement('canvas');
  labelCanvas.width = 384;
  labelCanvas.height = 80;
  const lctx = labelCanvas.getContext('2d');
  if (lctx) {
    lctx.fillStyle = 'rgba(7, 10, 18, 0.75)';
    lctx.roundRect(8, 8, 368, 64, 8);
    lctx.fill();
    lctx.strokeStyle = node.color;
    lctx.lineWidth = 1.5;
    lctx.stroke();

    lctx.fillStyle = '#ffffff';
    lctx.font = 'bold 22px Outfit, sans-serif';
    lctx.fillText(node.repo.name, 22, 38, 280);

    lctx.fillStyle = '#94a3b8';
    lctx.font = '14px "JetBrains Mono", monospace';
    const starStr = node.repo.stargazers_count > 999 
      ? `${(node.repo.stargazers_count / 1000).toFixed(1)}k` 
      : String(node.repo.stargazers_count);
    lctx.fillText(`★ ${starStr}  ·  ${node.repo.language || 'Code'}`, 22, 58);
  }
  const labelTex = new THREE.CanvasTexture(labelCanvas);
  const labelMat = new THREE.SpriteMaterial({
    map: labelTex,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  });
  const labelSprite = new THREE.Sprite(labelMat);
  labelSprite.scale.set(6.8, 1.4, 1);
  labelSprite.position.set(0, node.radius + 1.8, 0);
  group.add(labelSprite);

  // State flags
  let isHovered = false;
  let isSelected = false;
  let isDimmed = false;

  const update = (time: number, modeLerp: number, softwareGl: boolean) => {
    // Spin planetary body
    if (!softwareGl) {
      bodyMesh.rotation.y = time * 0.25;
      haloMesh.rotation.y = -time * 0.15;
    }

    // Update moons orbit
    moonMeshes.forEach(m => {
      const currentAngle = m.angle + time * m.speed;
      m.mesh.position.set(
        Math.cos(currentAngle) * m.dist,
        Math.sin(currentAngle * 1.5) * 0.4,
        Math.sin(currentAngle) * m.dist
      );
    });

    // Orbit position in Galaxy Mode
    const currentAngle = node.orbitAngle + time * node.orbitSpeed;
    const gx = Math.cos(currentAngle) * node.orbitRadius;
    const gy = Math.sin(node.orbitalTilt) * (node.orbitRadius * 0.35);
    const gz = Math.sin(currentAngle) * node.orbitRadius;

    // Tree position in Tree Mode
    const [tx, ty, tz] = node.treePosition;

    // Smoothly interpolate position between Galaxy Mode and Tree Mode
    group.position.x = THREE.MathUtils.lerp(gx, tx, modeLerp);
    group.position.y = THREE.MathUtils.lerp(gy, ty, modeLerp);
    group.position.z = THREE.MathUtils.lerp(gz, tz, modeLerp);

    // Fade orbit line when in Tree mode
    orbitMat.opacity = THREE.MathUtils.lerp(0.14, 0.0, modeLerp);

    // Selection ring animation
    if (isSelected) {
      selectRingMat.opacity = 0.8 + Math.sin(time * 4) * 0.2;
      selectRingMesh.rotation.z = time * 0.5;
    } else if (isHovered) {
      selectRingMat.opacity = 0.5;
    } else {
      selectRingMat.opacity = 0;
    }

    // Hover scale bounce
    const targetScale = isSelected ? 1.25 : isHovered ? 1.15 : 1.0;
    const currentScale = bodyMesh.scale.x;
    const newScale = THREE.MathUtils.damp(currentScale, targetScale, 10, 0.016);
    bodyMesh.scale.setScalar(newScale);
    haloMesh.scale.setScalar(newScale);

    // Dimming when search/filter active
    const targetOpacity = isDimmed ? 0.2 : 1.0;
    bodyMat.opacity = targetOpacity;
    bodyMat.transparent = isDimmed;
    haloMat.opacity = isDimmed ? 0.05 : 0.28;
    labelMat.opacity = isDimmed ? 0.15 : isHovered || isSelected ? 1.0 : 0.75;
  };

  const setHovered = (hovered: boolean) => {
    isHovered = hovered;
  };

  const setSelected = (selected: boolean) => {
    isSelected = selected;
  };

  const setDimmed = (dimmed: boolean) => {
    isDimmed = dimmed;
  };

  const dispose = () => {
    bodyGeo.dispose();
    bodyMat.dispose();
    haloGeo.dispose();
    haloMat.dispose();
    selectRingGeo.dispose();
    selectRingMat.dispose();
    orbitGeo.dispose();
    orbitMat.dispose();
    labelMat.dispose();
    labelTex.dispose();
    ringGeo?.dispose();
    ringMat?.dispose();
    moonMeshes.forEach(m => {
      m.mesh.geometry.dispose();
      (m.mesh.material as THREE.Material).dispose();
    });
  };

  return {
    node,
    group,
    bodyMesh,
    haloMesh,
    orbitLine,
    labelSprite,
    moonGroup,
    ringMesh,
    update,
    setHovered,
    setSelected,
    setDimmed,
    dispose,
  };
}
