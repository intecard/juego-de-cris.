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
  updateWeatherLighting: (dirLight: THREE.DirectionalLight, ambLight: THREE.AmbientLight, scene: THREE.Scene) => void;
}

export function build3DWorldEnvironment(level: LevelInfo): World3DEnvironment {
  const sceneGroup = new THREE.Group();

  // Terrain Base
  const terrainGeo = new THREE.PlaneGeometry(120, 120, 48, 48);
  terrainGeo.rotateX(-Math.PI / 2);

  const posAttr = terrainGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    // Heightmap noise
    let y = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 2.5;

    // Raise ceremonial altar hill at x=0, z=35
    const distToAltar = Math.hypot(x, z - 35);
    if (distToAltar < 15) {
      y += (15 - distToAltar) * 0.8;
    }

    posAttr.setY(i, y);
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(level.terrainColor),
    roughness: 0.8,
    flatShading: true,
  });

  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = true;
  sceneGroup.add(terrainMesh);

  // Ceremonial Monument Rock at (0, y, 35)
  const ceremonialGroup = new THREE.Group();
  ceremonialGroup.position.set(0, 4, 35);

  const rockGeo = new THREE.CylinderGeometry(3.5, 6.0, 6, 8);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x4a4e69, roughness: 0.9, flatShading: true });
  const ceremonialRockMesh = new THREE.Mesh(rockGeo, rockMat);
  ceremonialRockMesh.castShadow = true;
  ceremonialRockMesh.receiveShadow = true;

  // Glowing Legendary Egg atop rock
  const eggGeo = new THREE.SphereGeometry(0.8, 16, 16);
  eggGeo.scale(1.0, 1.3, 1.0);
  const eggMat = new THREE.MeshStandardMaterial({
    color: 0xffd166,
    emissive: 0xffb703,
    emissiveIntensity: 0.8,
    roughness: 0.2,
  });
  const eggMesh = new THREE.Mesh(eggGeo, eggMat);
  eggMesh.position.set(0, 3.8, 0);

  const eggLight = new THREE.PointLight(0xffb703, 3, 15);
  eggLight.position.set(0, 4.5, 0);

  ceremonialGroup.add(ceremonialRockMesh, eggMesh, eggLight);
  sceneGroup.add(ceremonialGroup);

  // Water Body (if applicable)
  let waterMesh: THREE.Mesh | undefined;
  if (level.biome === 'Swamp' || level.biome === 'River' || level.biome === 'Coast') {
    const waterGeo = new THREE.PlaneGeometry(120, 120);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0077b6,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1,
      metalness: 0.1,
    });
    waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = -0.5;
    sceneGroup.add(waterMesh);
  }

  // Foliage & Environment Props (Trees, Rocks, Crystals)
  const propCount = level.foliageDensity === 'Dense' ? 80 : level.foliageDensity === 'Medium' ? 45 : 20;

  const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
  const treeLeavesMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, flatShading: true });
  const crystalMat = new THREE.MeshStandardMaterial({ color: 0x48cae4, emissive: 0x00b4d8, emissiveIntensity: 0.5 });

  for (let i = 0; i < propCount; i++) {
    const rx = (Math.random() - 0.5) * 100;
    const rz = (Math.random() - 0.5) * 100;

    // Keep clear of center path and ceremonial altar
    if (Math.hypot(rx, rz) < 6 || Math.hypot(rx, rz - 35) < 12) continue;

    if (level.biome === 'Cave' || level.biome === 'Ruins') {
      // Crystal Formations or Ruin Pillars
      const crystalGeo = new THREE.ConeGeometry(0.8 + Math.random() * 0.8, 3 + Math.random() * 4, 5);
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(rx, 1.5, rz);
      crystal.rotation.z = (Math.random() - 0.5) * 0.4;
      sceneGroup.add(crystal);
    } else {
      // Prehistoric Trees / Palms
      const treeGroup = new THREE.Group();
      treeGroup.position.set(rx, 0, rz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 4, 6), treeTrunkMat);
      trunk.position.y = 2;
      trunk.castShadow = true;

      const canopy = new THREE.Mesh(new THREE.ConeGeometry(2.5, 4, 6), treeLeavesMat);
      canopy.position.y = 4.5;
      canopy.castShadow = true;

      treeGroup.add(trunk, canopy);
      sceneGroup.add(treeGroup);
    }
  }

  // Weather Particle System
  const particleCount = 400;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 100;
    particlePositions[i * 3 + 1] = Math.random() * 25;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
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

  const updateWeatherLighting = (dirLight: THREE.DirectionalLight, ambLight: THREE.AmbientLight, scene: THREE.Scene) => {
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
      // Sunny / Default Tropical
      scene.background = new THREE.Color(0x87ceeb);
      scene.fog = new THREE.FogExp2(0x87ceeb, 0.008);
      ambLight.intensity = 0.6;
      dirLight.intensity = 1.2;
      dirLight.color.setHex(0xffffff);
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
