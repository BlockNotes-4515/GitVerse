import * as THREE from 'three';

export interface CentralStarObject {
  group: THREE.Group;
  coreMesh: THREE.Mesh;
  coronaMesh: THREE.Mesh;
  light: THREE.PointLight;
  update: (time: number) => void;
  dispose: () => void;
}

export function createCentralStar(colorHex: string = '#06b6d4'): CentralStarObject {
  const group = new THREE.Group();
  group.name = 'central_star_group';

  // 1. Procedural Sun/Star Surface Texture
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, colorHex);
    grad.addColorStop(0.7, '#38bdf8');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Solar flares / granules
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, 12 + Math.random() * 25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  // 2. Central Stellar Core Mesh
  const coreGeo = new THREE.SphereGeometry(4.2, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffffff,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  coreMesh.name = 'central_star_core';
  group.add(coreMesh);

  // 3. Glowing Corona Atmospheric Shell
  const coronaGeo = new THREE.SphereGeometry(6.4, 32, 32);
  const coronaMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(colorHex),
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
  group.add(coronaMesh);

  // 4. Secondary Soft Flare Ring
  const flareGeo = new THREE.PlaneGeometry(28, 28);
  const flareCanvas = document.createElement('canvas');
  flareCanvas.width = 128;
  flareCanvas.height = 128;
  const fctx = flareCanvas.getContext('2d');
  if (fctx) {
    const fgrad = fctx.createRadialGradient(64, 64, 4, 64, 64, 60);
    fgrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    fgrad.addColorStop(0.2, colorHex);
    fgrad.addColorStop(0.6, 'rgba(6, 182, 212, 0.2)');
    fgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    fctx.fillStyle = fgrad;
    fctx.fillRect(0, 0, 128, 128);
  }
  const flareTexture = new THREE.CanvasTexture(flareCanvas);
  const flareMat = new THREE.MeshBasicMaterial({
    map: flareTexture,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const flareMesh = new THREE.Mesh(flareGeo, flareMat);
  group.add(flareMesh);

  // 5. Dynamic Omni Light from Central Star
  const light = new THREE.PointLight(colorHex, 3.5, 300, 1.2);
  light.position.set(0, 0, 0);
  group.add(light);

  const update = (time: number) => {
    coreMesh.rotation.y = time * 0.12;
    coronaMesh.rotation.y = -time * 0.08;
    coronaMesh.scale.setScalar(1 + Math.sin(time * 2.2) * 0.04);
    flareMesh.rotation.z = time * 0.05;
  };

  const dispose = () => {
    coreGeo.dispose();
    coreMat.dispose();
    coronaGeo.dispose();
    coronaMat.dispose();
    flareGeo.dispose();
    flareMat.dispose();
    texture.dispose();
    flareTexture.dispose();
  };

  return {
    group,
    coreMesh,
    coronaMesh,
    light,
    update,
    dispose,
  };
}
