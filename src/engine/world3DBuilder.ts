import * as THREE from 'three';
import { LevelInfo } from '../types/game';

export interface World3DEnvironment {
  sceneGroup: THREE.Group;
  terrainMesh: THREE.Mesh;
  ceremonialRockMesh: THREE.Mesh;
  eggMesh: THREE.Mesh;
  eggLight: THREE.PointLight;
  waterMesh?: THREE.Mesh;
  particleSystem: THREE.Points;
  updateParticles: (delta: number) => void;
  updateWeatherLighting: (
    dirLight: THREE.DirectionalLight,
    ambLight: THREE.AmbientLight,
    scene: THREE.Scene
  ) => void;
}

export function build3DWorldEnvironment(level: LevelInfo): World3DEnvironment {
  const sceneGroup = new THREE.Group();

  // --- TERRENO BASE CON RELIEVE Y VERDE SELVA PROFUNDO ---
  const terrainGeo = new THREE.PlaneGeometry(140, 140, 64, 64);
  terrainGeo.rotateX(-Math.PI / 2);

  const posAttr = terrainGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);

    // Ondulación natural del suelo tropical
    let y = Math.sin(x * 0.09) * Math.cos(z * 0.09) * 2.0;

    // Aplanar el sendero central de aventura (de Z = -30 hasta Z = 25)
    if (Math.abs(x) < 4.2 && z < 26) {
      y = 0;
    }

    // Elevar la colina de la Montaña Ceremonial (x = 0, z = 35)
    const distToAltar = Math.hypot(x, z - 35);
    if (distToAltar < 18) {
      y += (18 - distToAltar) * 0.7;
    }

    posAttr.setY(i, y);
  }
  terrainGeo.computeVertexNormals();

  // Color base verde musgo tropical
  const terrainMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(level.terrainColor || '#144523'),
    roughness: 0.9,
    flatShading: true,
  });

  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = true;
  sceneGroup.add(terrainMesh);

  // --- CAMINO DE AVENTURA (SENDERO DE BLOQUES) ---
  const pathGroup = new THREE.Group();
  const pathMat = new THREE.MeshStandardMaterial({
    color: 0x6d4c41,
    roughness: 0.95,
    flatShading: true,
  });

  for (let z = -26; z < 27; z += 2.8) {
    const tileGeo = new THREE.BoxGeometry(3.8, 0.18, 2.4);
    const tileMesh = new THREE.Mesh(tileGeo, pathMat);
    tileMesh.position.set((Math.random() - 0.5) * 0.5, 0.05, z);
    tileMesh.receiveShadow = true;
    pathGroup.add(tileMesh);
  }
  sceneGroup.add(pathGroup);

  // --- MONTAÑA CEREMONIAL VOXEL EN Z = 35 ---
  const ceremonialGroup = new THREE.Group();
  ceremonialGroup.position.set(0, 0, 35);

  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x3d405b,
    roughness: 0.9,
    flatShading: true,
  });

  const step1 = new THREE.Mesh(new THREE.BoxGeometry(14, 2, 14), rockMat);
  step1.position.y = 1;
  step1.castShadow = true;
  step1.receiveShadow = true;

  const step2 = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 10), rockMat);
  step2.position.y = 3;
  step2.castShadow = true;
  step2.receiveShadow = true;

  const ceremonialRockMesh = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 6), rockMat);
  ceremonialRockMesh.position.y = 5;
  ceremonialRockMesh.castShadow = true;
  ceremonialRockMesh.receiveShadow = true;

  ceremonialGroup.add(step1, step2, ceremonialRockMesh);

  // --- HUEVO LEGENDARIO Y PILARES EN LA CIMA ---
  const eggGeo = new THREE.SphereGeometry(1.0, 16, 16);
  eggGeo.scale(1.0, 1.35, 1.0);
  const eggMat = new THREE.MeshStandardMaterial({
    color: 0xffd166,
    emissive: 0xffa200,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.8,
  });
  const eggMesh = new THREE.Mesh(eggGeo, eggMat);
  eggMesh.position.set(0, 7.2, 0);

  const eggLight = new THREE.PointLight(0xffb703, 3.5, 20);
  eggLight.position.set(0, 7.8, 0);

  const pillarMat = new THREE.MeshStandardMaterial({ color: 0xb7b7a4, roughness: 0.6 });
  const pillarOffsets = [
    [-2, -2],
    [2, -2],
    [-2, 2],
    [2, 2],
  ];

  pillarOffsets.forEach(([px, pz]) => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.5, 0.8), pillarMat);
    pillar.position.set(px, 6.5, pz);
    pillar.castShadow = true;
    ceremonialGroup.add(pillar);
  });

  ceremonialGroup.add(eggMesh, eggLight);
  sceneGroup.add(ceremonialGroup);

  // --- CUERPO DE AGUA (RÍOS O PANTANOS) ---
  let waterMesh: THREE.Mesh | undefined;
  if (level.biome === 'Swamp' || level.biome === 'River' || level.biome === 'Coast') {
    const waterGeo = new THREE.PlaneGeometry(140, 140);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0077b6,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.2,
    });
    waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -0.4;
    sceneGroup.add(waterMesh);
  }

  // --- GENERACIÓN DE SELVA DENSA TIPO "CRIS_2.PNG" ---
  // Árboles altos, helechos, arbustos y maleza tropical Voxel
  const foliageGroup = new THREE.Group();
  const propCount = level.foliageDensity === 'Dense' ? 140 : level.foliageDensity === 'Medium' ? 85 : 45;

  const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4e3629, roughness: 0.9 });
  const leafColors = [0x1b4332, 0x2d6a4f, 0x40916c, 0x52b788, 0x74c69d];
  const bushColors = [0x2d6a4f, 0x40916c, 0x52b788, 0x78c6a3];

  for (let i = 0; i < propCount; i++) {
    const rx = (Math.random() - 0.5) * 115;
    const rz = (Math.random() - 0.5) * 115;

    // Respetar el sendero central de caminata
    if (Math.abs(rx) < 4.8 && rz < 28) continue;
    // Respetar la montaña ceremonial
    if (Math.hypot(rx, rz - 35) < 15) continue;

    const randType = Math.random();

    if (randType < 0.45) {
      // 1. ÁRBOL VOXEL ALTO TROPICAL
      const treeGroup = new THREE.Group();
      treeGroup.position.set(rx, 0, rz);

      const trunkHeight = 3.5 + Math.random() * 2.5;
      const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.8, trunkHeight, 0.8), treeTrunkMat);
      trunk.position.y = trunkHeight / 2;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const leafColor = leafColors[i % leafColors.length];
      const leafMat = new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.7, flatShading: true });

      const leavesBottom = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.6, 3.4), leafMat);
      leavesBottom.position.y = trunkHeight;
      leavesBottom.castShadow = true;

      const leavesTop = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 2.2), leafMat);
      leavesTop.position.y = trunkHeight + 1.3;
      leavesTop.castShadow = true;

      treeGroup.add(leavesBottom, leavesTop);
      foliageGroup.add(treeGroup);
    } else if (randType < 0.8) {
      // 2. ARBUSTO / MALEZA DENSA DEL SUELO (TIPO CRIS_2.PNG)
      const bushGroup = new THREE.Group();
      bushGroup.position.set(rx, 0.5, rz);

      const bushColor = bushColors[i % bushColors.length];
      const bushMat = new THREE.MeshStandardMaterial({ color: bushColor, roughness: 0.8, flatShading: true });

      // Agrupación de cubos para simular maleza frondosa
      const mainBush = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), bushMat);
      mainBush.castShadow = true;
      mainBush.receiveShadow = true;
      bushGroup.add(mainBush);

      const sideBush1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.1), bushMat);
      sideBush1.position.set(0.6, -0.15, 0.4);
      sideBush1.receiveShadow = true;
      bushGroup.add(sideBush1);

      const sideBush2 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 1.0), bushMat);
      sideBush2.position.set(-0.5, -0.2, -0.5);
      sideBush2.receiveShadow = true;
      bushGroup.add(sideBush2);

      bushGroup.rotation.y = Math.random() * Math.PI;
      foliageGroup.add(bushGroup);
    } else {
      // 3. HELECHOS TROPICALES Y PASTO VOXEL ALTO
      const fernGroup = new THREE.Group();
      fernGroup.position.set(rx, 0.3, rz);

      const fernMat = new THREE.MeshStandardMaterial({ color: 0x52b788, roughness: 0.6, flatShading: true });

      for (let f = 0; f < 4; f++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.9), fernMat);
        blade.rotation.y = (f * Math.PI) / 2;
        blade.rotation.x = 0.35; // Inclinado hacia afuera como hoja de helecho
        blade.position.y = 0.2;
        blade.castShadow = true;
        fernGroup.add(blade);
      }

      fernGroup.rotation.y = Math.random() * Math.PI;
      foliageGroup.add(fernGroup);
    }
  }

  sceneGroup.add(foliageGroup);

  // --- SISTEMA CLIMÁTICO DE PARTÍCULAS ---
  const particleCount = 350;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 120;
    particlePositions[i * 3 + 1] = Math.random() * 25;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 120;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  let pColor = 0xffffff;
  let pSize = 0.2;

  if (level.weather === 'Rain' || level.weather === 'Storm') {
    pColor = 0x8ecae6;
    pSize = 0.15;
  } else if (level.weather === 'Snow') {
    pColor = 0xffffff;
    pSize = 0.3;
  } else if (level.weather === 'Ash') {
    pColor = 0xffb703;
    pSize = 0.25;
  }

  const particleMat = new THREE.PointsMaterial({
    color: pColor,
    size: pSize,
    transparent: true,
    opacity: 0.6,
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  sceneGroup.add(particleSystem);

  const updateParticles = (delta: number) => {
    const pos = particleSystem.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < particleCount; i++) {
      let py = pos.getY(i) - delta * (level.weather === 'Rain' ? 18 : 6);
      if (py < 0) py = 25;
      pos.setY(i, py);
    }
    pos.needsUpdate = true;
  };

  const updateWeatherLighting = (
    dirLight: THREE.DirectionalLight,
    ambLight: THREE.AmbientLight,
    scene: THREE.Scene
  ) => {
    if (level.weather === 'Night') {
      scene.background = new THREE.Color(0x050515);
      scene.fog = new THREE.FogExp2(0x050515, 0.02);
      ambLight.intensity = 0.2;
      dirLight.intensity = 0.3;
      dirLight.color.setHex(0x3a86ff);
    } else if (level.weather === 'Ash' || level.biome === 'Volcano') {
      scene.background = new THREE.Color(0x2b090a);
      scene.fog = new THREE.FogExp2(0x2b090a, 0.025);
      ambLight.intensity = 0.5;
      dirLight.intensity = 0.8;
      dirLight.color.setHex(0xff4d6d);
    } else if (level.weather === 'Snow') {
      scene.background = new THREE.Color(0xd8e2dc);
      scene.fog = new THREE.FogExp2(0xd8e2dc, 0.015);
      ambLight.intensity = 0.8;
      dirLight.intensity = 1.0;
      dirLight.color.setHex(0xf8f9fa);
    } else {
      // Clima Tropical de Selva (Fondo Verde Profundo)
      scene.background = new THREE.Color(0x0d331a);
      scene.fog = new THREE.FogExp2(0x0d331a, 0.018);
      ambLight.intensity = 0.55;
      dirLight.intensity = 1.8;
      dirLight.color.setHex(0xffea85);
    }
  };

  return {
    sceneGroup,
    terrainMesh,
    ceremonialRockMesh,
    eggMesh,
    eggLight,
    waterMesh,
    particleSystem,
    updateParticles,
    updateWeatherLighting,
  };
}