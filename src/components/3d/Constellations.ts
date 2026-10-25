import * as THREE from 'three';
import { PlanetObject } from './PlanetObject';

export interface ConstellationSystem {
  linesGroup: THREE.Group;
  treeLinesGroup: THREE.Group;
  update: (time: number, modeLerp: number) => void;
  dispose: () => void;
}

export function createConstellations(planetObjects: PlanetObject[]): ConstellationSystem {
  const linesGroup = new THREE.Group();
  linesGroup.name = 'constellation_lines';

  const treeLinesGroup = new THREE.Group();
  treeLinesGroup.name = 'tree_lines';

  // 1. Constellation Connections (Shared language/topics in Galaxy Mode)
  const lineMaterials: THREE.LineBasicMaterial[] = [];
  const lineMeshes: { line: THREE.Line; pA: PlanetObject; pB: PlanetObject }[] = [];

  for (let i = 0; i < planetObjects.length; i++) {
    for (let j = i + 1; j < planetObjects.length; j++) {
      const pA = planetObjects[i];
      const pB = planetObjects[j];

      const sameLang = pA.node.repo.language && pA.node.repo.language === pB.node.repo.language;
      const sharedTopic = pA.node.repo.topics?.some(t => pB.node.repo.topics?.includes(t));

      if (sameLang || sharedTopic) {
        // Only connect if not too far apart in orbit order to avoid clutter
        if (Math.abs(pA.node.orbitRadius - pB.node.orbitRadius) < 25) {
          const geo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(),
            new THREE.Vector3(),
          ]);

          const mat = new THREE.LineBasicMaterial({
            color: new THREE.Color(pA.node.color),
            transparent: true,
            opacity: 0.12,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          lineMaterials.push(mat);

          const line = new THREE.Line(geo, mat);
          linesGroup.add(line);
          lineMeshes.push({ line, pA, pB });
        }
      }
    }
  }

  // 2. Tree Connections (Root to Branch, Branch to Leaves in Tree Mode)
  const treeLineMeshes: { line: THREE.Line; planet: PlanetObject }[] = [];
  const rootPoint = new THREE.Vector3(0, 0, 0);

  planetObjects.forEach(planet => {
    const geo = new THREE.BufferGeometry().setFromPoints([
      rootPoint,
      new THREE.Vector3(...planet.node.treePosition),
    ]);

    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(planet.node.color),
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
    });
    lineMaterials.push(mat);

    const line = new THREE.Line(geo, mat);
    treeLinesGroup.add(line);
    treeLineMeshes.push({ line, planet });
  });

  const pPosA = new THREE.Vector3();
  const pPosB = new THREE.Vector3();

  const update = (_time: number, modeLerp: number) => {
    // Galaxy constellation lines
    const galaxyOpacity = THREE.MathUtils.lerp(0.12, 0.0, modeLerp);
    lineMeshes.forEach(({ line, pA, pB }) => {
      (line.material as THREE.LineBasicMaterial).opacity = galaxyOpacity;
      if (galaxyOpacity > 0.01) {
        pA.group.getWorldPosition(pPosA);
        pB.group.getWorldPosition(pPosB);
        const posAttr = line.geometry.attributes.position as THREE.BufferAttribute;
        posAttr.setXYZ(0, pPosA.x, pPosA.y, pPosA.z);
        posAttr.setXYZ(1, pPosB.x, pPosB.y, pPosB.z);
        posAttr.needsUpdate = true;
      }
    });

    // Tree hierarchy lines
    const treeOpacity = THREE.MathUtils.lerp(0.0, 0.22, modeLerp);
    treeLineMeshes.forEach(({ line, planet }) => {
      (line.material as THREE.LineBasicMaterial).opacity = treeOpacity;
      if (treeOpacity > 0.01) {
        planet.group.getWorldPosition(pPosB);
        const posAttr = line.geometry.attributes.position as THREE.BufferAttribute;
        posAttr.setXYZ(0, 0, 0, 0); // central developer star
        posAttr.setXYZ(1, pPosB.x, pPosB.y, pPosB.z);
        posAttr.needsUpdate = true;
      }
    });
  };

  const dispose = () => {
    lineMeshes.forEach(l => l.line.geometry.dispose());
    treeLineMeshes.forEach(l => l.line.geometry.dispose());
    lineMaterials.forEach(m => m.dispose());
  };

  return {
    linesGroup,
    treeLinesGroup,
    update,
    dispose,
  };
}
