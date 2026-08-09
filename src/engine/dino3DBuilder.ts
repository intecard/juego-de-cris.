import * as THREE from 'three';

export interface Dino3DInstance {
  mesh: THREE.Group;
  headGroup: THREE.Group;
  tailGroup: THREE.Group;
  leftLegGroup: THREE.Group;
  rightLegGroup: THREE.Group;
  wingsGroup?: THREE.Group;
  saddleSpot: THREE.Vector3;
  updateAnimation: (delta: number, speed: number, isAction?: boolean) => void;
}

export function build3DDinosaur(
  modelType: string,
  primaryColorHex: string = '#800020',
  secondaryColorHex: string = '#d4af37',
  scaleMultiplier: number = 1.0
): Dino3DInstance {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  const headGroup = new THREE.Group();
  const tailGroup = new THREE.Group();
  const leftLegGroup = new THREE.Group();
  const rightLegGroup = new THREE.Group();
  const wingsGroup = new THREE.Group();

  const primaryMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(primaryColorHex),
    roughness: 0.6,
  });

  const secondaryMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(secondaryColorHex),
    roughness: 0.5,
  });

  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xff1111, roughness: 0.3 });
  const toothMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.4 });
  const saddleMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 });
  const clawMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.5 });

  let animTime = 0;
  const saddlePos = new THREE.Vector3(0, 1.8, 0);

  switch (modelType) {
    case 'velociraptor': {
      // Body Voxel
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 1.4), primaryMat);
      body.position.set(0, 0.9, 0);
      body.castShadow = true;
      bodyGroup.add(body);

      // Stripes / Detail Blocks on Back
      const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.15, 0.3), secondaryMat);
      stripe1.position.set(0, 1.15, -0.2);
      bodyGroup.add(stripe1);

      // Neck & Head
      headGroup.position.set(0, 1.2, 0.7);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.5), primaryMat);
      neck.position.set(0, 0.2, 0.1);
      neck.rotation.x = -0.3;

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.4, 0.8), primaryMat);
      head.position.set(0, 0.5, 0.3);
      head.castShadow = true;

      const snoutTop = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.4), secondaryMat);
      snoutTop.position.set(0, 0.73, 0.45);

      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), eyeMat);
      eyeL.position.set(-0.24, 0.6, 0.4);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), eyeMat);
      eyeR.position.set(0.24, 0.6, 0.4);

      // Sharp Teeth
      const toothL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.05), toothMat);
      toothL.position.set(-0.18, 0.28, 0.6);
      const toothR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.12, 0.05), toothMat);
      toothR.position.set(0.18, 0.28, 0.6);

      headGroup.add(neck, head, snoutTop, eyeL, eyeR, toothL, toothR);

      // Tail
      tailGroup.position.set(0, 0.9, -0.7);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 1.6), primaryMat);
      tail.position.set(0, 0, -0.8);
      tail.castShadow = true;
      tailGroup.add(tail);

      // Legs with Raptor Claw
      leftLegGroup.position.set(-0.45, 0.8, -0.1);
      const lThigh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.35), secondaryMat);
      lThigh.position.y = -0.3;
      const lClaw = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.4), primaryMat);
      lClaw.position.set(0, -0.6, 0.1);
      const lSickleClaw = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.15), clawMat);
      lSickleClaw.position.set(-0.08, -0.55, 0.25);
      leftLegGroup.add(lThigh, lClaw, lSickleClaw);

      rightLegGroup.position.set(0.45, 0.8, -0.1);
      const rThigh = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.35), secondaryMat);
      rThigh.position.y = -0.3;
      const rClaw = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.4), primaryMat);
      rClaw.position.set(0, -0.6, 0.1);
      const rSickleClaw = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.15), clawMat);
      rSickleClaw.position.set(0.08, -0.55, 0.25);
      rightLegGroup.add(rThigh, rClaw, rSickleClaw);

      saddlePos.set(0, 1.35, 0);
      break;
    }

    case 'trex':
    case 'king_trex': {
      const isKing = modelType === 'king_trex';
      const sz = isKing ? 1.8 : 1.0;

      // Heavy Voxel Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.6 * sz, 1.8 * sz, 2.5 * sz), primaryMat);
      body.position.set(0, 1.8 * sz, 0);
      body.castShadow = true;

      if (isKing) {
        // Glowing Lava Spikes on King Rex
        for (let i = 0; i < 5; i++) {
          const spike = new THREE.Mesh(new THREE.BoxGeometry(0.3 * sz, 0.6 * sz, 0.3 * sz), secondaryMat);
          spike.position.set(0, 2.9 * sz, (-1.0 + i * 0.5) * sz);
          bodyGroup.add(spike);
        }
      }
      bodyGroup.add(body);

      // Massive Jaw Head
      headGroup.position.set(0, 2.8 * sz, 1.2 * sz);
      const skull = new THREE.Mesh(new THREE.BoxGeometry(1.0 * sz, 1.0 * sz, 1.6 * sz), primaryMat);
      skull.position.set(0, 0.2 * sz, 0.5 * sz);
      skull.castShadow = true;

      const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.9 * sz, 0.4 * sz, 1.4 * sz), secondaryMat);
      jaw.position.set(0, -0.4 * sz, 0.5 * sz);

      for (let i = 0; i < 6; i++) {
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.08 * sz, 0.22 * sz, 0.08 * sz), toothMat);
        tooth.position.set(
          i % 2 === 0 ? -0.4 * sz : 0.4 * sz,
          -0.2 * sz,
          (0.1 + i * 0.2) * sz
        );
        headGroup.add(tooth);
      }

      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.12 * sz, 0.12 * sz, 0.12 * sz), eyeMat);
      eyeL.position.set(-0.52 * sz, 0.4 * sz, 0.8 * sz);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.12 * sz, 0.12 * sz, 0.12 * sz), eyeMat);
      eyeR.position.set(0.52 * sz, 0.4 * sz, 0.8 * sz);

      headGroup.add(skull, jaw, eyeL, eyeR);

      // Tail
      tailGroup.position.set(0, 1.8 * sz, -1.2 * sz);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.8 * sz, 0.8 * sz, 2.8 * sz), primaryMat);
      tail.position.set(0, -0.2 * sz, -1.4 * sz);
      tail.castShadow = true;
      tailGroup.add(tail);

      // Strong Legs
      leftLegGroup.position.set(-0.9 * sz, 1.5 * sz, -0.2 * sz);
      const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.5 * sz, 1.5 * sz, 0.7 * sz), secondaryMat);
      lLeg.position.y = -0.75 * sz;
      lLeg.castShadow = true;
      leftLegGroup.add(lLeg);

      rightLegGroup.position.set(0.9 * sz, 1.5 * sz, -0.2 * sz);
      const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.5 * sz, 1.5 * sz, 0.7 * sz), secondaryMat);
      rLeg.position.y = -0.75 * sz;
      rLeg.castShadow = true;
      rightLegGroup.add(rLeg);

      saddlePos.set(0, 2.85 * sz, 0);
      break;
    }

    case 'triceratops': {
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 2.2), primaryMat);
      body.position.set(0, 1.1, 0);
      body.castShadow = true;
      bodyGroup.add(body);

      // Frill & Horns Head
      headGroup.position.set(0, 1.2, 1.1);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 1.0), primaryMat);
      head.castShadow = true;

      // Large Shield Frill (Blocky Voxel Style)
      const frill = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 0.25), secondaryMat);
      frill.rotation.x = Math.PI / 6;
      frill.position.set(0, 0.6, -0.3);

      // 3 Voxel Horns
      const horn1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.9, 0.14), toothMat);
      horn1.rotation.x = Math.PI / 4;
      horn1.position.set(-0.35, 0.6, 0.4);

      const horn2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.9, 0.14), toothMat);
      horn2.rotation.x = Math.PI / 4;
      horn2.position.set(0.35, 0.6, 0.4);

      const hornNose = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.45, 0.12), toothMat);
      hornNose.rotation.x = Math.PI / 4;
      hornNose.position.set(0, 0.2, 0.8);

      headGroup.add(head, frill, horn1, horn2, hornNose);

      // Tail
      tailGroup.position.set(0, 1.1, -1.1);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 1.4), primaryMat);
      tail.position.set(0, -0.2, -0.7);
      tailGroup.add(tail);

      // 4 Heavy Legs
      leftLegGroup.position.set(-0.8, 0.8, 0);
      const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.4), secondaryMat);
      lLeg.position.y = -0.4;
      lLeg.castShadow = true;
      leftLegGroup.add(lLeg);

      rightLegGroup.position.set(0.8, 0.8, 0);
      const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.4), secondaryMat);
      rLeg.position.y = -0.4;
      rLeg.castShadow = true;
      rightLegGroup.add(rLeg);

      saddlePos.set(0, 1.85, 0);
      break;
    }

    case 'pteranodon':
    case 'quetzalcoatlus': {
      // Lean Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 1.2), primaryMat);
      body.position.set(0, 1.5, 0);
      body.castShadow = true;
      bodyGroup.add(body);

      // Crested Head & Long Beak
      headGroup.position.set(0, 1.6, 0.6);
      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1.2), secondaryMat);
      beak.position.set(0, 0, 0.6);

      const crest = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.4, 0.8), primaryMat);
      crest.rotation.x = -Math.PI / 4;
      crest.position.set(0, 0.3, -0.3);

      headGroup.add(beak, crest);

      // Wings Voxel
      const leftWing = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 0.8), primaryMat);
      leftWing.position.set(-1.3, 1.5, 0);
      leftWing.castShadow = true;

      const rightWing = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 0.8), primaryMat);
      rightWing.position.set(1.3, 1.5, 0);
      rightWing.castShadow = true;

      wingsGroup.add(leftWing, rightWing);

      saddlePos.set(0, 1.85, 0);
      break;
    }

    default: {
      // Generic Quadruped / Biped Low-Poly Voxel Dino
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.8), primaryMat);
      body.position.set(0, 1.0, 0);
      body.castShadow = true;
      bodyGroup.add(body);

      headGroup.position.set(0, 1.4, 0.9);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.8), primaryMat);
      headGroup.add(head);

      tailGroup.position.set(0, 1.0, -0.9);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 1.2), primaryMat);
      tail.position.set(0, 0, -0.6);
      tailGroup.add(tail);

      leftLegGroup.position.set(-0.6, 0.7, 0);
      const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.7, 0.3), secondaryMat);
      lLeg.position.y = -0.35;
      leftLegGroup.add(lLeg);

      rightLegGroup.position.set(0.6, 0.7, 0);
      const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.7, 0.3), secondaryMat);
      rLeg.position.y = -0.35;
      rightLegGroup.add(rLeg);

      saddlePos.set(0, 1.65, 0);
      break;
    }
  }

  // Saddle mesh on back
  const saddleMesh = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.8), saddleMat);
  saddleMesh.position.copy(saddlePos);
  bodyGroup.add(saddleMesh);

  root.add(bodyGroup, headGroup, tailGroup, leftLegGroup, rightLegGroup, wingsGroup);
  root.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);

  const updateAnimation = (delta: number, speed: number, isAction: boolean = false) => {
    animTime += delta * (speed > 0.1 ? speed * 8 : 2);
    const swing = Math.sin(animTime);

    if (wingsGroup.children.length > 0) {
      // Flapping wings
      wingsGroup.children[0].rotation.z = Math.sin(animTime * 2) * 0.4;
      wingsGroup.children[1].rotation.z = -Math.sin(animTime * 2) * 0.4;
    } else {
      leftLegGroup.rotation.x = swing * 0.6;
      rightLegGroup.rotation.x = -swing * 0.6;
    }

    tailGroup.rotation.y = Math.cos(animTime * 0.8) * 0.25;

    if (isAction) {
      headGroup.rotation.x = -0.4 + Math.sin(animTime * 4) * 0.3; // Roar / Bite
    } else {
      headGroup.rotation.x = Math.sin(animTime * 0.5) * 0.05;
    }
  };

  return {
    mesh: root,
    headGroup,
    tailGroup,
    leftLegGroup,
    rightLegGroup,
    wingsGroup,
    saddleSpot: saddlePos,
    updateAnimation,
  };
}