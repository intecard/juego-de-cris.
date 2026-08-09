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
  primaryColorHex: string = '#c86428',
  secondaryColorHex: string = '#e6ba85',
  scaleMultiplier: number = 1.0
): Dino3DInstance {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  const headGroup = new THREE.Group();
  const tailGroup = new THREE.Group();
  const leftLegGroup = new THREE.Group();
  const rightLegGroup = new THREE.Group();
  const wingsGroup = new THREE.Group();

  // Materiales basados en la paleta Voxel AAA de referencia
  const primaryMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(primaryColorHex),
    roughness: 0.7,
    flatShading: true,
  });

  const secondaryMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(secondaryColorHex),
    roughness: 0.6,
    flatShading: true,
  });

  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.3 });
  const bossEyeMat = new THREE.MeshStandardMaterial({
    color: 0xff3300,
    emissive: 0xff1100,
    emissiveIntensity: 0.9,
    roughness: 0.2,
  }); // Ojos de lava brillantes para el Jefe T-Rex Rey

  const toothMat = new THREE.MeshStandardMaterial({ color: 0xfefae0, roughness: 0.4 });
  const tongueMat = new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.6 });
  const clawMat = new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.5 });
  const plateOrangeMat = new THREE.MeshStandardMaterial({ color: 0xf3722c, roughness: 0.6 });
  const saddleMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.8 });

  let animTime = 0;
  const saddlePos = new THREE.Vector3(0, 1.8, 0);

  const cleanType = modelType.toLowerCase().trim();

  switch (cleanType) {
    case 'velociraptor': {
      // --- VELOCIRAPTOR VOXEL ---
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.75, 1.5), primaryMat);
      body.position.set(0, 1.0, 0);
      body.castShadow = true;
      bodyGroup.add(body);

      const stripe1 = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.15, 0.4), secondaryMat);
      stripe1.position.set(0, 1.3, -0.2);
      bodyGroup.add(stripe1);

      headGroup.position.set(0, 1.3, 0.75);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.65, 0.5), primaryMat);
      neck.position.set(0, 0.15, 0.1);
      neck.rotation.x = -0.3;

      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.85), primaryMat);
      snout.position.set(0, 0.5, 0.35);
      snout.castShadow = true;

      const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.18, 0.75), secondaryMat);
      jaw.position.set(0, 0.2, 0.35);

      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), eyeMat);
      eyeL.position.set(-0.26, 0.6, 0.35);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), eyeMat);
      eyeR.position.set(0.26, 0.6, 0.35);

      const teeth = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 0.6), toothMat);
      teeth.position.set(0, 0.3, 0.4);

      headGroup.add(neck, snout, jaw, eyeL, eyeR, teeth);

      tailGroup.position.set(0, 1.0, -0.75);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 1.8), primaryMat);
      tail.position.set(0, 0, -0.9);
      tail.castShadow = true;
      tailGroup.add(tail);

      leftLegGroup.position.set(-0.48, 0.85, -0.1);
      const lThigh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.4), primaryMat);
      lThigh.position.y = -0.3;
      const lClaw = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.18), clawMat);
      lClaw.position.set(-0.08, -0.65, 0.25);
      leftLegGroup.add(lThigh, lClaw);

      rightLegGroup.position.set(0.48, 0.85, -0.1);
      const rThigh = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.4), primaryMat);
      rThigh.position.y = -0.3;
      const rClaw = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.18), clawMat);
      rClaw.position.set(0.08, -0.65, 0.25);
      rightLegGroup.add(rThigh, rClaw);

      saddlePos.set(0, 1.45, 0);
      break;
    }

    case 'trex':
    case 'king_trex':
    case 'trex_rey':
    case 't-rex rey': {
      // --- T-REX REY VOXEL COLOSAL (JEFE NIVEL 25) ---
      const isKing = cleanType !== 'trex';
      const sz = isKing ? 2.5 : 1.25; // ¡TAMAÑO COLOSAL DE JEFE FINAL!

      const body = new THREE.Mesh(new THREE.BoxGeometry(1.6 * sz, 1.8 * sz, 2.6 * sz), primaryMat);
      body.position.set(0, 1.9 * sz, 0);
      body.castShadow = true;
      bodyGroup.add(body);

      const belly = new THREE.Mesh(new THREE.BoxGeometry(1.4 * sz, 0.6 * sz, 2.4 * sz), secondaryMat);
      belly.position.set(0, 1.1 * sz, 0);
      bodyGroup.add(belly);

      if (isKing) {
        // Corona de 7 grandes espinas dorsales magmáticas
        for (let i = 0; i < 7; i++) {
          const spike = new THREE.Mesh(
            new THREE.BoxGeometry(0.35 * sz, 0.55 * sz, 0.35 * sz),
            plateOrangeMat
          );
          spike.position.set(0, 2.95 * sz, (-1.2 + i * 0.42) * sz);
          bodyGroup.add(spike);
        }
      }

      // Cabeza imponente con mandíbula masiva
      headGroup.position.set(0, 2.9 * sz, 1.3 * sz);
      const skull = new THREE.Mesh(new THREE.BoxGeometry(1.2 * sz, 0.95 * sz, 1.7 * sz), primaryMat);
      skull.position.set(0, 0.3 * sz, 0.6 * sz);
      skull.castShadow = true;

      const jaw = new THREE.Mesh(new THREE.BoxGeometry(1.1 * sz, 0.45 * sz, 1.6 * sz), secondaryMat);
      jaw.position.set(0, -0.35 * sz, 0.55 * sz);

      const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.6 * sz, 0.15 * sz, 1.0 * sz), tongueMat);
      tongue.position.set(0, -0.2 * sz, 0.6 * sz);
      headGroup.add(tongue);

      // Dientes blancos prominentes
      for (let i = 0; i < 8; i++) {
        const tooth = new THREE.Mesh(
          new THREE.BoxGeometry(0.11 * sz, 0.3 * sz, 0.11 * sz),
          toothMat
        );
        tooth.position.set(
          i % 2 === 0 ? -0.48 * sz : 0.48 * sz,
          -0.18 * sz,
          (0.1 + i * 0.18) * sz
        );
        headGroup.add(tooth);
      }

      // Ojos de lava para el Rey, ojos normales para el T-Rex base
      const selectedEyeMat = isKing ? bossEyeMat : eyeMat;
      const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.15 * sz, 0.15 * sz, 0.15 * sz), selectedEyeMat);
      eyeL.position.set(-0.62 * sz, 0.45 * sz, 0.9 * sz);
      const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.15 * sz, 0.15 * sz, 0.15 * sz), selectedEyeMat);
      eyeR.position.set(0.62 * sz, 0.45 * sz, 0.9 * sz);

      headGroup.add(skull, jaw, eyeL, eyeR);

      // Cola masiva y poderosa
      tailGroup.position.set(0, 2.1 * sz, -1.3 * sz);
      const tail1 = new THREE.Mesh(new THREE.BoxGeometry(1.1 * sz, 1.1 * sz, 1.6 * sz), primaryMat);
      tail1.position.set(0, 0, -0.8 * sz);
      const tail2 = new THREE.Mesh(new THREE.BoxGeometry(0.7 * sz, 0.7 * sz, 1.8 * sz), primaryMat);
      tail2.position.set(0, -0.1 * sz, -2.2 * sz);
      tailGroup.add(tail1, tail2);

      // Piernas colosales
      leftLegGroup.position.set(-0.95 * sz, 1.6 * sz, -0.2 * sz);
      const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.6 * sz, 1.6 * sz, 0.8 * sz), primaryMat);
      lLeg.position.y = -0.8 * sz;
      leftLegGroup.add(lLeg);

      rightLegGroup.position.set(0.95 * sz, 1.6 * sz, -0.2 * sz);
      const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.6 * sz, 1.6 * sz, 0.8 * sz), primaryMat);
      rLeg.position.y = -0.8 * sz;
      rightLegGroup.add(rLeg);

      // Silla de montar ajustada a su altura gigantesca
      saddlePos.set(0, 3.05 * sz, 0);
      break;
    }

    case 'triceratops': {
      // --- TRICERATOPS VOXEL ---
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 2.6), primaryMat);
      body.position.set(0, 1.2, 0);
      body.castShadow = true;
      bodyGroup.add(body);

      headGroup.position.set(0, 1.3, 1.3);
      const head = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 1.1), primaryMat);

      const frill = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.5, 0.3), secondaryMat);
      frill.rotation.x = Math.PI / 5;
      frill.position.set(0, 0.7, -0.4);

      const horn1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.1, 0.18), toothMat);
      horn1.rotation.x = Math.PI / 4;
      horn1.position.set(-0.4, 0.7, 0.5);

      const horn2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.1, 0.18), toothMat);
      horn2.rotation.x = Math.PI / 4;
      horn2.position.set(0.4, 0.7, 0.5);

      const hornNose = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.15), toothMat);
      hornNose.rotation.x = Math.PI / 4;
      hornNose.position.set(0, 0.2, 0.9);

      headGroup.add(head, frill, horn1, horn2, hornNose);

      tailGroup.position.set(0, 1.1, -1.3);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 1.5), primaryMat);
      tail.position.set(0, -0.2, -0.7);
      tailGroup.add(tail);

      leftLegGroup.position.set(-0.85, 0.85, 0);
      const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.85, 0.45), secondaryMat);
      lLeg.position.y = -0.42;
      leftLegGroup.add(lLeg);

      rightLegGroup.position.set(0.85, 0.85, 0);
      const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.85, 0.45), secondaryMat);
      rLeg.position.y = -0.42;
      rightLegGroup.add(rLeg);

      saddlePos.set(0, 2.05, 0);
      break;
    }

    case 'stegosaurus': {
      // --- ESTEGOSAURIO VOXEL ---
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 2.8), primaryMat);
      body.position.set(0, 1.1, 0);
      body.castShadow = true;
      bodyGroup.add(body);

      for (let i = 0; i < 7; i++) {
        const plateL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.7, 0.5), plateOrangeMat);
        plateL.position.set(-0.3, 1.95, -1.1 + i * 0.38);
        bodyGroup.add(plateL);

        const plateR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.7, 0.5), plateOrangeMat);
        plateR.position.set(0.3, 1.95, -0.9 + i * 0.38);
        bodyGroup.add(plateR);
      }

      headGroup.position.set(0, 0.9, 1.4);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.5, 0.8), primaryMat);
      headGroup.add(head);

      tailGroup.position.set(0, 1.0, -1.4);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 1.8), primaryMat);
      tail.position.set(0, 0, -0.9);

      const spikeL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.12, 0.12), toothMat);
      spikeL.position.set(0, 0.1, -1.5);
      tailGroup.add(tail, spikeL);

      leftLegGroup.position.set(-0.75, 0.8, 0);
      const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.4), secondaryMat);
      lLeg.position.y = -0.4;
      leftLegGroup.add(lLeg);

      rightLegGroup.position.set(0.75, 0.8, 0);
      const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.8, 0.4), secondaryMat);
      rLeg.position.y = -0.4;
      rightLegGroup.add(rLeg);

      saddlePos.set(0, 1.95, 0);
      break;
    }

    case 'spinosaurus': {
      // --- ESPINOSAURIO VOXEL ---
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.6, 2.8), primaryMat);
      body.position.set(0, 1.8, 0);
      bodyGroup.add(body);

      const sail = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.3, 2.2), plateOrangeMat);
      sail.position.set(0, 2.8, 0);
      bodyGroup.add(sail);

      headGroup.position.set(0, 2.3, 1.4);
      const snout = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 1.4), primaryMat);
      snout.position.set(0, 0, 0.5);
      headGroup.add(snout);

      tailGroup.position.set(0, 1.8, -1.4);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 2.4), primaryMat);
      tail.position.set(0, 0, -1.2);
      tailGroup.add(tail);

      leftLegGroup.position.set(-0.8, 1.4, -0.2);
      const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.4, 0.6), secondaryMat);
      lLeg.position.y = -0.7;
      leftLegGroup.add(lLeg);

      rightLegGroup.position.set(0.8, 1.4, -0.2);
      const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.4, 0.6), secondaryMat);
      rLeg.position.y = -0.7;
      rightLegGroup.add(rLeg);

      saddlePos.set(0, 2.7, 0);
      break;
    }

    case 'pteranodon':
    case 'quetzalcoatlus': {
      // --- PTERANODON VOXEL ---
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 1.4), primaryMat);
      body.position.set(0, 1.7, 0);
      body.castShadow = true;
      bodyGroup.add(body);

      headGroup.position.set(0, 1.9, 0.7);
      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 1.4), secondaryMat);
      beak.position.set(0, 0, 0.7);

      const crest = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 1.0), primaryMat);
      crest.rotation.x = -Math.PI / 4;
      crest.position.set(0, 0.35, -0.35);

      headGroup.add(beak, crest);

      const leftWing = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 1.0), primaryMat);
      leftWing.position.set(-1.6, 1.7, 0);
      leftWing.castShadow = true;

      const rightWing = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.1, 1.0), primaryMat);
      rightWing.position.set(1.6, 1.7, 0);
      rightWing.castShadow = true;

      wingsGroup.add(leftWing, rightWing);

      saddlePos.set(0, 2.1, 0);
      break;
    }

    default: {
      // --- DINOSAURIO GENÉRICO ---
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.1, 2.0), primaryMat);
      body.position.set(0, 1.1, 0);
      body.castShadow = true;
      bodyGroup.add(body);

      headGroup.position.set(0, 1.5, 1.0);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.9), primaryMat);
      headGroup.add(head);

      tailGroup.position.set(0, 1.1, -1.0);
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 1.4), primaryMat);
      tail.position.set(0, 0, -0.7);
      tailGroup.add(tail);

      leftLegGroup.position.set(-0.7, 0.8, 0);
      const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.8, 0.35), secondaryMat);
      lLeg.position.y = -0.4;
      leftLegGroup.add(lLeg);

      rightLegGroup.position.set(0.7, 0.8, 0);
      const rLeg = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.8, 0.35), secondaryMat);
      rLeg.position.y = -0.4;
      rightLegGroup.add(rLeg);

      saddlePos.set(0, 1.75, 0);
      break;
    }
  }

  // Silla de montar en el lomo
  const saddleMesh = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.22, 0.85), saddleMat);
  saddleMesh.position.copy(saddlePos);
  bodyGroup.add(saddleMesh);

  root.add(bodyGroup, headGroup, tailGroup, leftLegGroup, rightLegGroup, wingsGroup);
  root.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);

  const updateAnimation = (delta: number, speed: number, isAction: boolean = false) => {
    animTime += delta * (speed > 0.1 ? speed * 8 : 2);
    const swing = Math.sin(animTime);

    if (wingsGroup.children.length > 0) {
      wingsGroup.children[0].rotation.z = Math.sin(animTime * 2) * 0.45;
      wingsGroup.children[1].rotation.z = -Math.sin(animTime * 2) * 0.45;
    } else {
      leftLegGroup.rotation.x = swing * 0.65;
      rightLegGroup.rotation.x = -swing * 0.65;
    }

    tailGroup.rotation.y = Math.cos(animTime * 0.8) * 0.3;

    if (isAction) {
      headGroup.rotation.x = -0.45 + Math.sin(animTime * 4) * 0.35;
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