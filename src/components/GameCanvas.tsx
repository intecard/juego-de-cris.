import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VoxelCharacter } from '../engine/voxelCharacter';
import { build3DDinosaur, Dino3DInstance } from '../engine/dino3DBuilder';
import { build3DWorldEnvironment, World3DEnvironment } from '../engine/world3DBuilder';
import { LevelInfo, GameSettings, Dinosaur } from '../types/game';
import { createDinosaurFromSpecies } from '../data/dinosaurs';
import { sound } from '../utils/audio';

interface GameCanvasProps {
  currentLevel: LevelInfo;
  settings: GameSettings;
  mountedDino: Dinosaur | null;
  joystickInput: { dx: number; dy: number };
  onApproachWildDino: (dino: Dinosaur) => void;
  onClimbCeremonialRock: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentLevel,
  settings,
  mountedDino,
  joystickInput,
  onApproachWildDino,
  onClimbCeremonialRock,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- THREE.JS SCENE SETUP (ATMÓSFERA SELVA VIBRANTE) ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d331a);
    scene.fog = new THREE.FogExp2(0x0d331a, 0.018);

    const camera = new THREE.PerspectiveCamera(
      48, // Ángulo de visión cinematográfico (más natural, menos deformado)
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      200
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.graphicsQuality === 'Ultra' ? 2 : 1.5));
    renderer.shadowMap.enabled = settings.shadowsEnabled;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // --- ILUMINACIÓN TROPICAL DORADA (TIPO CRIS_2.PNG) ---
    const ambLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambLight);

    // Sol tropical cálido desde arriba a la derecha
    const dirLight = new THREE.DirectionalLight(0xffea85, 1.8);
    dirLight.position.set(25, 45, 20);
    dirLight.castShadow = settings.shadowsEnabled;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Luz de rebote de la vegetación verde del suelo
    const hemiLight = new THREE.HemisphereLight(0xfffae6, 0x144523, 0.7);
    scene.add(hemiLight);

    // --- WORLD ENVIRONMENT ---
    const worldEnv: World3DEnvironment = build3DWorldEnvironment(currentLevel);
    scene.add(worldEnv.sceneGroup);
    worldEnv.updateWeatherLighting(dirLight, ambLight, scene);

    // --- PLAYER CHARACTER (LEO/CRIS & FROG) ---
    const player = new VoxelCharacter();
    scene.add(player.mesh);
    player.mesh.position.set(0, 0, -20);

    // --- MOUNTED DINOSAUR MESH (If Riding) ---
    let mountedMesh3D: Dino3DInstance | null = null;
    if (mountedDino) {
      mountedMesh3D = build3DDinosaur(
        mountedDino.modelType,
        mountedDino.colorHex,
        mountedDino.secondaryColorHex,
        mountedDino.scale
      );
      scene.add(mountedMesh3D.mesh);
      player.isMounted = true;
    }

    // --- WILD DINOSAURS ROAMING ---
    const wildDinoMeshes: { dinoData: Dinosaur; mesh3D: Dino3DInstance; pos: THREE.Vector3 }[] = [];
    const wildSpecies = currentLevel.wildDinoSpecies;

    for (let i = 0; i < Math.min(5, wildSpecies.length + 2); i++) {
      const spId = wildSpecies[i % wildSpecies.length];
      const wildData = createDinosaurFromSpecies(spId, currentLevel.recommendedLevel);
      const mesh3D = build3DDinosaur(wildData.modelType, wildData.colorHex, wildData.secondaryColorHex, wildData.scale);

      const rx = (Math.random() - 0.5) * 55;
      const rz = (Math.random() - 0.5) * 45;
      mesh3D.mesh.position.set(rx, 0, rz);
      scene.add(mesh3D.mesh);

      wildDinoMeshes.push({ dinoData: wildData, mesh3D, pos: mesh3D.mesh.position });
    }

    // --- KEYBOARD CONTROLS SUPPORT ---
    const keysPressed: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => { keysPressed[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed[e.key.toLowerCase()] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // --- RESIZE OBSERVER ---
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Handle Movement Input (Joystick + WASD)
      let moveX = joystickInput.dx;
      let moveZ = joystickInput.dy;

      if (keysPressed['w'] || keysPressed['arrowup']) moveZ = -1;
      if (keysPressed['s'] || keysPressed['arrowdown']) moveZ = 1;
      if (keysPressed['a'] || keysPressed['arrowleft']) moveX = -1;
      if (keysPressed['d'] || keysPressed['arrowright']) moveX = 1;

      const speed = Math.hypot(moveX, moveZ);

      if (speed > 0.05) {
        const moveAngle = Math.atan2(moveX, moveZ);
        const moveSpeed = (mountedDino ? 11 : 6.5) * delta;

        player.mesh.position.x += Math.sin(moveAngle) * moveSpeed;
        player.mesh.position.z += Math.cos(moveAngle) * moveSpeed;
        player.mesh.rotation.y = moveAngle;

        if (mountedMesh3D) {
          mountedMesh3D.mesh.position.copy(player.mesh.position);
          mountedMesh3D.mesh.rotation.y = moveAngle;
          player.mesh.position.y = mountedMesh3D.saddleSpot.y;
        }

        if (Math.random() < 0.05) sound.playSound('step');
      }

      // Update Animations
      player.updateAnimation(delta, speed);
      if (mountedMesh3D) mountedMesh3D.updateAnimation(delta, speed);

      // Wild Dinos Roaming & Collision Detection
      wildDinoMeshes.forEach(item => {
        item.mesh3D.updateAnimation(delta, 0.2);

        const dist = player.mesh.position.distanceTo(item.pos);
        if (dist < 3.2) {
          onApproachWildDino(item.dinoData);
        }
      });

      // Check Ceremonial Rock at (0, y, 35)
      const distToAltar = Math.hypot(player.mesh.position.x, player.mesh.position.z - 35);
      if (distToAltar < 4.0) {
        onClimbCeremonialRock();
      }

      // CÁMARA EN 3ERA PERSONA CERCANA E IMPONENTE (ESTILO AAA)
      // Te sigue más cerca y a nivel de hombros para resaltar los gráficos Voxel
      camera.position.x = player.mesh.position.x;
      camera.position.y = player.mesh.position.y + 4.2;
      camera.position.z = player.mesh.position.z - 8.5;
      camera.lookAt(player.mesh.position.x, player.mesh.position.y + 2.2, player.mesh.position.z + 4);

      // Weather Particles
      worldEnv.updateParticles(delta);

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [currentLevel, settings, mountedDino, joystickInput]);

  return <div ref={containerRef} className="w-full h-full absolute inset-0 bg-slate-950" />;
};import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VoxelCharacter } from '../engine/voxelCharacter';
import { build3DDinosaur, Dino3DInstance } from '../engine/dino3DBuilder';
import { build3DWorldEnvironment, World3DEnvironment } from '../engine/world3DBuilder';
import { LevelInfo, GameSettings, Dinosaur } from '../types/game';
import { createDinosaurFromSpecies } from '../data/dinosaurs';
import { sound } from '../utils/audio';

interface GameCanvasProps {
  currentLevel: LevelInfo;
  settings: GameSettings;
  mountedDino: Dinosaur | null;
  joystickInput: { dx: number; dy: number };
  onApproachWildDino: (dino: Dinosaur) => void;
  onClimbCeremonialRock: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  currentLevel,
  settings,
  mountedDino,
  joystickInput,
  onApproachWildDino,
  onClimbCeremonialRock,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- THREE.JS SCENE SETUP (ATMÓSFERA SELVA VIBRANTE) ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d331a);
    scene.fog = new THREE.FogExp2(0x0d331a, 0.018);

    const camera = new THREE.PerspectiveCamera(
      48, // Ángulo de visión cinematográfico (más natural, menos deformado)
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      200
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, settings.graphicsQuality === 'Ultra' ? 2 : 1.5));
    renderer.shadowMap.enabled = settings.shadowsEnabled;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    containerRef.current.appendChild(renderer.domElement);

    // --- ILUMINACIÓN TROPICAL DORADA (TIPO CRIS_2.PNG) ---
    const ambLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambLight);

    // Sol tropical cálido desde arriba a la derecha
    const dirLight = new THREE.DirectionalLight(0xffea85, 1.8);
    dirLight.position.set(25, 45, 20);
    dirLight.castShadow = settings.shadowsEnabled;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Luz de rebote de la vegetación verde del suelo
    const hemiLight = new THREE.HemisphereLight(0xfffae6, 0x144523, 0.7);
    scene.add(hemiLight);

    // --- WORLD ENVIRONMENT ---
    const worldEnv: World3DEnvironment = build3DWorldEnvironment(currentLevel);
    scene.add(worldEnv.sceneGroup);
    worldEnv.updateWeatherLighting(dirLight, ambLight, scene);

    // --- PLAYER CHARACTER (LEO/CRIS & FROG) ---
    const player = new VoxelCharacter();
    scene.add(player.mesh);
    player.mesh.position.set(0, 0, -20);

    // --- MOUNTED DINOSAUR MESH (If Riding) ---
    let mountedMesh3D: Dino3DInstance | null = null;
    if (mountedDino) {
      mountedMesh3D = build3DDinosaur(
        mountedDino.modelType,
        mountedDino.colorHex,
        mountedDino.secondaryColorHex,
        mountedDino.scale
      );
      scene.add(mountedMesh3D.mesh);
      player.isMounted = true;
    }

    // --- WILD DINOSAURS ROAMING ---
    const wildDinoMeshes: { dinoData: Dinosaur; mesh3D: Dino3DInstance; pos: THREE.Vector3 }[] = [];
    const wildSpecies = currentLevel.wildDinoSpecies;

    for (let i = 0; i < Math.min(5, wildSpecies.length + 2); i++) {
      const spId = wildSpecies[i % wildSpecies.length];
      const wildData = createDinosaurFromSpecies(spId, currentLevel.recommendedLevel);
      const mesh3D = build3DDinosaur(wildData.modelType, wildData.colorHex, wildData.secondaryColorHex, wildData.scale);

      const rx = (Math.random() - 0.5) * 55;
      const rz = (Math.random() - 0.5) * 45;
      mesh3D.mesh.position.set(rx, 0, rz);
      scene.add(mesh3D.mesh);

      wildDinoMeshes.push({ dinoData: wildData, mesh3D, pos: mesh3D.mesh.position });
    }

    // --- KEYBOARD CONTROLS SUPPORT ---
    const keysPressed: Record<string, boolean> = {};
    const handleKeyDown = (e: KeyboardEvent) => { keysPressed[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed[e.key.toLowerCase()] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // --- RESIZE OBSERVER ---
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Handle Movement Input (Joystick + WASD)
      let moveX = joystickInput.dx;
      let moveZ = joystickInput.dy;

      if (keysPressed['w'] || keysPressed['arrowup']) moveZ = -1;
      if (keysPressed['s'] || keysPressed['arrowdown']) moveZ = 1;
      if (keysPressed['a'] || keysPressed['arrowleft']) moveX = -1;
      if (keysPressed['d'] || keysPressed['arrowright']) moveX = 1;

      const speed = Math.hypot(moveX, moveZ);

      if (speed > 0.05) {
        const moveAngle = Math.atan2(moveX, moveZ);
        const moveSpeed = (mountedDino ? 11 : 6.5) * delta;

        player.mesh.position.x += Math.sin(moveAngle) * moveSpeed;
        player.mesh.position.z += Math.cos(moveAngle) * moveSpeed;
        player.mesh.rotation.y = moveAngle;

        if (mountedMesh3D) {
          mountedMesh3D.mesh.position.copy(player.mesh.position);
          mountedMesh3D.mesh.rotation.y = moveAngle;
          player.mesh.position.y = mountedMesh3D.saddleSpot.y;
        }

        if (Math.random() < 0.05) sound.playSound('step');
      }

      // Update Animations
      player.updateAnimation(delta, speed);
      if (mountedMesh3D) mountedMesh3D.updateAnimation(delta, speed);

      // Wild Dinos Roaming & Collision Detection
      wildDinoMeshes.forEach(item => {
        item.mesh3D.updateAnimation(delta, 0.2);

        const dist = player.mesh.position.distanceTo(item.pos);
        if (dist < 3.2) {
          onApproachWildDino(item.dinoData);
        }
      });

      // Check Ceremonial Rock at (0, y, 35)
      const distToAltar = Math.hypot(player.mesh.position.x, player.mesh.position.z - 35);
      if (distToAltar < 4.0) {
        onClimbCeremonialRock();
      }

      // CÁMARA EN 3ERA PERSONA CERCANA E IMPONENTE (ESTILO AAA)
      // Te sigue más cerca y a nivel de hombros para resaltar los gráficos Voxel
      camera.position.x = player.mesh.position.x;
      camera.position.y = player.mesh.position.y + 4.2;
      camera.position.z = player.mesh.position.z - 8.5;
      camera.lookAt(player.mesh.position.x, player.mesh.position.y + 2.2, player.mesh.position.z + 4);

      // Weather Particles
      worldEnv.updateParticles(delta);

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [currentLevel, settings, mountedDino, joystickInput]);

  return <div ref={containerRef} className="w-full h-full absolute inset-0 bg-slate-950" />;
};