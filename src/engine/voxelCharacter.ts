import * as THREE from 'three';

export class VoxelCharacter {
  public mesh: THREE.Group;
  public bodyGroup: THREE.Group;
  public headGroup: THREE.Group;
  public leftArmGroup: THREE.Group;
  public rightArmGroup: THREE.Group;
  public leftLegGroup: THREE.Group;
  public rightLegGroup: THREE.Group;
  public frogGroup: THREE.Group;
  public isMounted: boolean = false;

  private animTime: number = 0;

  constructor() {
    this.mesh = new THREE.Group();
    this.bodyGroup = new THREE.Group();
    this.headGroup = new THREE.Group();
    this.leftArmGroup = new THREE.Group();
    this.rightArmGroup = new THREE.Group();
    this.leftLegGroup = new THREE.Group();
    this.rightLegGroup = new THREE.Group();
    this.frogGroup = new THREE.Group();

    this.buildCharacter();
  }

  private buildCharacter() {
    // Colors based on reference image
    const skinMat = new THREE.MeshStandardMaterial({ color: 0x9b6b43, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.8 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf4d03f, roughness: 0.5 }); // Yellow pineapple shirt
    const pineappleGreenMat = new THREE.MeshStandardMaterial({ color: 0x27ae60 });
    const pineappleOrangeMat = new THREE.MeshStandardMaterial({ color: 0xe67e22 });
    const hatStrawMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, roughness: 0.7 });
    const hatBandMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c }); // Palm tree band
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.8, roughness: 0.2 });
    const denimMat = new THREE.MeshStandardMaterial({ color: 0x2980b9, roughness: 0.7 }); // Blue denim shorts
    const sneakerMat = new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.6 }); // Greenish grey sneakers
    const sneakerSoleMat = new THREE.MeshStandardMaterial({ color: 0xecf0f1, roughness: 0.4 });
    const frogGreenMat = new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.5 });
    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const eyeBlackMat = new THREE.MeshStandardMaterial({ color: 0x111111 });

    // --- TORSO & HAWAIAN SHIRT ---
    const chestGeo = new THREE.BoxGeometry(0.7, 0.9, 0.4);
    const chestMesh = new THREE.Mesh(chestGeo, skinMat);
    chestMesh.position.y = 1.05;
    chestMesh.castShadow = true;
    this.bodyGroup.add(chestMesh);

    // Open Pineapple Shirt
    const shirtLeft = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.92, 0.44), shirtMat);
    shirtLeft.position.set(-0.2, 1.05, 0.01);
    shirtLeft.castShadow = true;
    this.bodyGroup.add(shirtLeft);

    const shirtRight = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.92, 0.44), shirtMat);
    shirtRight.position.set(0.2, 1.05, 0.01);
    shirtRight.castShadow = true;
    this.bodyGroup.add(shirtRight);

    // Pineapple spots on shirt
    for (let i = 0; i < 4; i++) {
      const spot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.46), pineappleOrangeMat);
      spot.position.set(i % 2 === 0 ? -0.22 : 0.22, 0.85 + (i * 0.15), 0.01);
      this.bodyGroup.add(spot);

      const crown = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.47), pineappleGreenMat);
      crown.position.set(spot.position.x, spot.position.y + 0.08, 0.01);
      this.bodyGroup.add(crown);
    }

    // Gold Chain & Cross Necklace
    const chainGeo = new THREE.BoxGeometry(0.3, 0.04, 0.42);
    const chainMesh = new THREE.Mesh(chainGeo, goldMat);
    chainMesh.position.set(0, 1.35, 0.01);
    this.bodyGroup.add(chainMesh);

    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.04), goldMat);
    crossV.position.set(0, 1.22, 0.22);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.04), goldMat);
    crossH.position.set(0, 1.25, 0.22);
    this.bodyGroup.add(crossV, crossH);

    // --- HEAD & HAT ---
    this.headGroup.position.set(0, 1.55, 0);

    const headGeo = new THREE.BoxGeometry(0.55, 0.55, 0.52);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Curly Hair
    const hairGeo = new THREE.BoxGeometry(0.58, 0.25, 0.55);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.2, -0.02);
    this.headGroup.add(hairMesh);

    // Eyes & Nose
    const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), eyeBlackMat);
    leftEye.position.set(-0.14, 0.04, 0.27);
    const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), eyeBlackMat);
    rightEye.position.set(0.14, 0.04, 0.27);

    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), skinMat);
    nose.position.set(0, -0.04, 0.28);

    this.headGroup.add(leftEye, rightEye, nose);

    // Straw Hat with Tropical Palm Band
    const hatBrim = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.9), hatStrawMat);
    hatBrim.position.set(0, 0.32, 0);
    hatBrim.rotation.x = -0.05;
    hatBrim.castShadow = true;

    const hatCrown = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.32, 0.58), hatStrawMat);
    hatCrown.position.set(0, 0.48, 0);
    hatCrown.castShadow = true;

    const hatBand = new THREE.Mesh(new THREE.BoxGeometry(0.60, 0.1, 0.60), hatBandMat);
    hatBand.position.set(0, 0.38, 0);

    this.headGroup.add(hatBrim, hatCrown, hatBand);

    // --- SHOULDER FROG (On Left Shoulder) ---
    this.frogGroup.position.set(-0.42, 1.48, 0.02);

    const frogBody = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.16, 0.2), frogGreenMat);
    frogBody.castShadow = true;

    const frogEyeLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), eyeWhiteMat);
    frogEyeLeft.position.set(-0.06, 0.1, 0.06);
    const frogPupilLeft = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.03), eyeBlackMat);
    frogPupilLeft.position.set(-0.06, 0.1, 0.09);

    const frogEyeRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.06), eyeWhiteMat);
    frogEyeRight.position.set(0.06, 0.1, 0.06);
    const frogPupilRight = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.03), eyeBlackMat);
    frogPupilRight.position.set(0.06, 0.1, 0.09);

    this.frogGroup.add(frogBody, frogEyeLeft, frogPupilLeft, frogEyeRight, frogPupilRight);

    // --- ARMS ---
    // Left Arm
    this.leftArmGroup.position.set(-0.45, 1.4, 0);
    const lArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.75, 0.22), skinMat);
    lArmMesh.position.y = -0.35;
    lArmMesh.castShadow = true;
    const lSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.25, 0.26), shirtMat);
    lSleeve.position.y = -0.12;
    this.leftArmGroup.add(lArmMesh, lSleeve);

    // Right Arm
    this.rightArmGroup.position.set(0.45, 1.4, 0);
    const rArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.75, 0.22), skinMat);
    rArmMesh.position.y = -0.35;
    rArmMesh.castShadow = true;
    const rSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.25, 0.26), shirtMat);
    rSleeve.position.y = -0.12;
    this.rightArmGroup.add(rArmMesh, rSleeve);

    // --- LEGS & SNEAKERS ---
    // Left Leg
    this.leftLegGroup.position.set(-0.2, 0.65, 0);
    const lShorts = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.35, 0.28), denimMat);
    lShorts.position.y = -0.15;
    const lLegSkin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.22), skinMat);
    lLegSkin.position.y = -0.42;
    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.15, 0.35), sneakerMat);
    lShoe.position.set(0, -0.58, 0.05);
    const lSole = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.37), sneakerSoleMat);
    lSole.position.set(0, -0.64, 0.05);
    this.leftLegGroup.add(lShorts, lLegSkin, lShoe, lSole);

    // Right Leg
    this.rightLegGroup.position.set(0.2, 0.65, 0);
    const rShorts = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.35, 0.28), denimMat);
    rShorts.position.y = -0.15;
    const rLegSkin = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 0.22), skinMat);
    rLegSkin.position.y = -0.42;
    const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.15, 0.35), sneakerMat);
    rShoe.position.set(0, -0.58, 0.05);
    const rSole = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.04, 0.37), sneakerSoleMat);
    rSole.position.set(0, -0.64, 0.05);
    this.rightLegGroup.add(rShorts, rLegSkin, rShoe, rSole);

    // Assemble character
    this.mesh.add(
      this.bodyGroup,
      this.headGroup,
      this.frogGroup,
      this.leftArmGroup,
      this.rightArmGroup,
      this.leftLegGroup,
      this.rightLegGroup
    );

    this.mesh.scale.set(0.9, 0.9, 0.9);
  }

  public updateAnimation(delta: number, speed: number) {
    this.animTime += delta * (speed > 0.1 ? speed * 12 : 3);

    if (this.isMounted) {
      // Sitting stance on dinosaur saddle
      this.leftLegGroup.rotation.x = -Math.PI / 2.5;
      this.leftLegGroup.rotation.y = -0.3;
      this.rightLegGroup.rotation.x = -Math.PI / 2.5;
      this.rightLegGroup.rotation.y = 0.3;

      this.leftArmGroup.rotation.x = -Math.PI / 4;
      this.rightArmGroup.rotation.x = -Math.PI / 4;

      // Cute frog bounce while riding
      this.frogGroup.position.y = 1.48 + Math.sin(this.animTime * 3) * 0.04;
      return;
    }

    if (speed > 0.1) {
      // Walking / Running swing animation
      const swing = Math.sin(this.animTime);

      this.leftArmGroup.rotation.x = swing * 0.8;
      this.rightArmGroup.rotation.x = -swing * 0.8;

      this.leftLegGroup.rotation.x = -swing * 0.8;
      this.rightLegGroup.rotation.x = swing * 0.8;

      this.headGroup.rotation.y = Math.sin(this.animTime * 0.5) * 0.05;

      // Frog subtle hop
      this.frogGroup.position.y = 1.48 + Math.abs(Math.sin(this.animTime * 2)) * 0.06;
    } else {
      // Idle breathing stance
      const breath = Math.sin(this.animTime * 0.8) * 0.03;

      this.bodyGroup.position.y = breath * 0.5;
      this.headGroup.position.y = 1.55 + breath;
      this.frogGroup.position.y = 1.48 + breath;

      this.leftArmGroup.rotation.x = 0;
      this.rightArmGroup.rotation.x = 0;
      this.leftLegGroup.rotation.x = 0;
      this.rightLegGroup.rotation.x = 0;
    }
  }
}
