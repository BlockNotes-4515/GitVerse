import * as THREE from 'three';

export function createStarfield(count: number = 2800): THREE.Points {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const starColors = [
    new THREE.Color('#ffffff'), // pure white
    new THREE.Color('#bae6fd'), // ice blue
    new THREE.Color('#67e8f9'), // electric cyan
    new THREE.Color('#c084fc'), // lavender
    new THREE.Color('#fed7aa'), // warm amber
  ];

  for (let i = 0; i < count; i++) {
    // Distribute stars on a wide spherical shell with depth
    const radius = 90 + Math.random() * 450;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    // Pick color
    const c = starColors[Math.floor(Math.random() * starColors.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    // Varied star size
    sizes[i] = (0.8 + Math.random() * 2.2);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Procedural circular star particle texture
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(165, 243, 252, 0.85)');
    grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
  }
  const starTexture = new THREE.CanvasTexture(canvas);

  const material = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    map: starTexture,
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

export function createNebulaClouds(): THREE.Group {
  const group = new THREE.Group();

  // Create subtle procedural glowing gas clouds
  const cloudCount = 6;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.4, 'rgba(6, 182, 212, 0.4)');
    grad.addColorStop(0.8, 'rgba(124, 58, 237, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);

  const colors = ['#0891b2', '#7c3aed', '#0284c7', '#4f46e5'];

  for (let i = 0; i < cloudCount; i++) {
    const planeGeo = new THREE.PlaneGeometry(160, 160);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(planeGeo, planeMat);
    const angle = (i / cloudCount) * Math.PI * 2;
    const dist = 140 + Math.random() * 60;
    mesh.position.set(
      Math.cos(angle) * dist,
      (Math.random() - 0.5) * 80,
      Math.sin(angle) * dist
    );
    mesh.rotation.z = Math.random() * Math.PI;
    mesh.rotation.y = Math.random() * Math.PI;
    group.add(mesh);
  }

  return group;
}
