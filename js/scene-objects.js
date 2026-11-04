/**
 * Scene Objects
 * Pemodelan 3D Presisi Gedung Rektorat & Kolam Refleksi ITS
 * Sesuai foto dan video asli observasi lapangan.
 */

class RektoratBuilding extends SceneNode {
  constructor(gl, materials) {
    super("RektoratBuilding");
    this.gl = gl;
    this.materials = materials;

    this.buildArchitecture();
  }

  buildArchitecture() {
    const gl = this.gl;
    const mats = this.materials;

    // 1. Badan Gedung Tengah (Central Tower Block)
    const mainBody = new SceneNode("MainCenterBody");
    mainBody.geometry = GeometryFactory.createBox(gl, 13.0, 6.8, 8.0, 2, 1);
    mainBody.material = mats.facade;
    mainBody.setPosition(0, 3.4, -16.5);
    this.addChild(mainBody);

    // 2. Sayap Kiri Gedung (Left Wing)
    const leftWing = new SceneNode("LeftWing");
    leftWing.geometry = GeometryFactory.createBox(gl, 7.5, 5.6, 7.2, 1, 1);
    leftWing.material = mats.facade;
    leftWing.setPosition(-9.8, -0.6, 0.3);
    mainBody.addChild(leftWing);

    // Atap Sayap Kiri
    const leftRoof = new SceneNode("LeftWing");
    leftRoof.geometry = GeometryFactory.createBox(gl, 7.3, 0.6, 7.6, 1, 1);
    leftRoof.material = mats.concrete;
    leftRoof.setPosition(-0.3, 2.6, 0.0);
    leftWing.addChild(leftRoof);

    // 3. Sayap Kanan Gedung (Right Wing)
    const rightWing = new SceneNode("RightWing");
    rightWing.geometry = GeometryFactory.createBox(gl, 7.5, 5.6, 7.2, 1, 1);
    rightWing.material = mats.facade;
    rightWing.setPosition(9.8, -0.6, 0.3);
    mainBody.addChild(rightWing);

    // Atap Sayap Kiri
    const rightRoof = new SceneNode("LeftWing");
    rightRoof.geometry = GeometryFactory.createBox(gl, 7.3, 0.6, 7.6, 1, 1);
    rightRoof.material = mats.concrete;
    rightRoof.setPosition(0.3, 2.6, 0.0);
    rightWing.addChild(rightRoof);

    // --- BAGIAN DEPAN MENJOROK (PORCH) LEBIH LUAS PADA SUMBU Z ---

    // A. Atap/Kanopi Porch
    const frontPorchRoof = new SceneNode("FrontPorchRoof");
    frontPorchRoof.geometry = GeometryFactory.createBox(gl, 9.6, 0.8, 8.0);
    frontPorchRoof.material = mats.concrete;
    frontPorchRoof.setPosition(0, 1.2, 5.0); 
    mainBody.addChild(frontPorchRoof);

    // B. Plafon / Langit-langit di Bawah Kanopi
    const porchCeiling = new SceneNode("PorchCeiling");
    porchCeiling.geometry = GeometryFactory.createBox(gl, 9.2, 0.1, 7.8);
    porchCeiling.material = mats.stone;
    porchCeiling.setPosition(0, -0.4, 0.0);
    frontPorchRoof.addChild(porchCeiling);

    // 4. 8 Pilar Kolom Vertikal Putih
    const pillarX = [-4.5, -2.3, 2.3, 4.5];
    const pillarZCoords = [-1.0, 3.7]; // Z depan dan Z belakang area porch

    for (let p = 0; p < pillarZCoords.length; p++) {
      const zPos = pillarZCoords[p];
      for (let i = 0; i < pillarX.length; i++) {
        const pillar = new SceneNode(`Pillar_${p}_${i}`);
        pillar.geometry = GeometryFactory.createBox(gl, 0.45, 4.8, 0.5);
        pillar.material = mats.concrete;
        pillar.setPosition(pillarX[i], -2.4, zPos); 
        frontPorchRoof.addChild(pillar);
      }
    }

    // 5. Lobby & Pintu Masuk Bawah (Recessed Entrance Lobby)
    const lobbyGlass = new SceneNode("LobbyGlass");
    lobbyGlass.geometry = GeometryFactory.createBox(gl, 4.4, 2.8, 0.2);
    lobbyGlass.material = mats.stone;
    lobbyGlass.setPosition(0, -1.8, 4.05);
    mainBody.addChild(lobbyGlass);

    // 6. Plang Logo ITS
    const signBoard = new SceneNode("SignBoard");
    signBoard.geometry = GeometryFactory.createBox(gl, 4.6, 2.3, 0.15);
    signBoard.material = mats.rektoratSign;
    signBoard.setPosition(0, 1.9, 4.15); 
    mainBody.addChild(signBoard);

    const porchSign = new RektoratSign(gl, mats, mats.canopySign);
    porchSign.setScale(0.4, 0.4, 0.4);
    porchSign.setPosition(1.2, -0.4, 3.4);
    frontPorchRoof.addChild(porchSign);

    // 7. Atap Limasan Bertingkat Khas ITS
    const lowerRoof = new SceneNode("LowerTieredRoof");
    lowerRoof.geometry = GeometryFactory.createHipRoof(gl, 15.5, 9.4, 8.0, 4.8, 2.2, 3, 2);
    lowerRoof.material = mats.roof;
    lowerRoof.setPosition(0, 3.4, 0); 
    mainBody.addChild(lowerRoof);

    const atticWall = new SceneNode("AtticWall");
    atticWall.geometry = GeometryFactory.createBox(gl, 7.8, 0.8, 4.6);
    atticWall.material = mats.concrete;
    atticWall.setPosition(0, 2.2 + 0.4, 0); 
    lowerRoof.addChild(atticWall);

    const upperRoof = new SceneNode("UpperTieredRoof");
    upperRoof.geometry = GeometryFactory.createPyramid(gl, 8.4, 5.2, 2.6, 2, 2);
    upperRoof.material = mats.roof;
    upperRoof.setPosition(0, 0.4, 0); 
    atticWall.addChild(upperRoof);
  }
}

class FlagPole extends SceneNode {
  constructor(gl, materials) {
    super("FlagPoleSystem");
    this.gl = gl;
    this.materials = materials;

    this.buildPoleAndFlag();
  }

  buildPoleAndFlag() {
    const gl = this.gl;
    const mats = this.materials;

    // Tiang Silinder Tinggi Menjulang di Depan Gedung
    const pole = new SceneNode("PoleShaft");
    pole.geometry = GeometryFactory.createCylinder(gl, 0.08, 8.5, 16);
    pole.material = mats.metal;
    pole.setPosition(0, 4.25, -4);
    this.addChild(pole);

    // Bola Emas Puncak Tiang
    const finial = new SceneNode("GoldFinial");
    finial.geometry = GeometryFactory.createBox(gl, 0.25, 0.25, 0.25);
    finial.material = mats.gold;
    finial.setPosition(0, 4.3, 0);
    pole.addChild(finial);

    // Bendera Merah Putih (Hierarchical Child dari Tiang)
    this.flagNode = new SceneNode("FlagMesh");
    this.flagNode.geometry = GeometryFactory.createBox(gl, 1.8, 1.1, 0.04);
    this.flagNode.material = mats.flag;
    this.flagNode.setPosition(0.95, 3.4, 0);
    pole.addChild(this.flagNode);
  }

  // Animasi Bendera Berkibar
  animate(time) {
    if (this.flagNode) {
      const wave = Math.sin(time * 5.0) * 0.15;
      const flap = Math.cos(time * 7.0) * 0.08;
      this.flagNode.setRotation(flap, wave, 0);
    }
  }
}

class FountainSystem extends SceneNode {
  constructor(gl, materials) {
    super("FountainSystem");
    this.gl = gl;
    this.materials = materials;
    this.waterJets = [];

    this.buildReflectionPool();
  }

  buildReflectionPool() {
    const gl = this.gl;
    const mats = this.materials;

    // Dimensi Kolam Refleksi Persegi Panjang Sesuai Foto Asli
    const poolW = 9.2;    // Lebar kolam
    const poolL = 21.0;   // Panjang kolam membujur
    const centerZ = 4.5;  // Titik tengah kolam pada sumbu Z

    // 1. Permukaan Air Kolam Hijau Toska
    this.waterSurface = new SceneNode("WaterSurface");
    this.waterSurface.geometry = GeometryFactory.createBox(gl, poolW - 0.2, 0.08, poolL - 0.2, 3, 5);
    this.waterSurface.material = mats.water;
    this.waterSurface.setPosition(0, 0.04, centerZ);
    this.addChild(this.waterSurface);

    // 2. Bibir / Bingkai Bata Merah Terakota (Terracotta Coping)
    const rimH = 0.18;
    const rimThick = 1.45;

    // Bibir Kiri
    const leftRim = new SceneNode("LeftRim");
    leftRim.geometry = GeometryFactory.createBox(gl, rimThick, rimH, poolL + rimThick);
    leftRim.material = mats.rim;
    leftRim.setPosition(-(poolW / 2), rimH / 2, centerZ);
    this.addChild(leftRim);

    // Bibir Kanan
    const rightRim = new SceneNode("RightRim");
    rightRim.geometry = GeometryFactory.createBox(gl, rimThick, rimH, poolL + rimThick);
    rightRim.material = mats.rim;
    rightRim.setPosition(poolW / 2, rimH / 2, centerZ);
    this.addChild(rightRim);

    // Bibir Depan (Dekat Kamera)
    const frontRim = new SceneNode("FrontRim");
    frontRim.geometry = GeometryFactory.createBox(gl, poolW + rimThick, rimH, rimThick);
    frontRim.material = mats.rim;
    frontRim.setPosition(0, rimH / 2, centerZ + poolL / 2);
    this.addChild(frontRim);

    // Bibir Belakang (Dekat Gedung)
    const backRim = new SceneNode("BackRim");
    backRim.geometry = GeometryFactory.createBox(gl, poolW + rimThick, rimH, rimThick);
    backRim.material = mats.rim;
    backRim.setPosition(0, rimH / 2, centerZ - poolL / 2);
    this.addChild(backRim);

    // 3. Formasi Bebatuan Alami di Tengah Kolam (Sesuai Foto Asli)
    const rockPositions = [
      [ 0.0, 0.28, centerZ - 2.5, 1.2, 0.5, 0.9],
      [ 0.0, 0.32, centerZ + 0.0, 1.5, 0.6, 1.1],
      [-0.4, 0.25, centerZ + 0.2, 0.8, 0.4, 0.8],
      [ 0.0, 0.28, centerZ + 2.5, 1.2, 0.5, 0.9],
    ];

    for (let i = 0; i < rockPositions.length; i++) {
      const [rx, ry, rz, sx, sy, sz] = rockPositions[i];
      const rock = new SceneNode(`Rock_${i}`);
      rock.geometry = GeometryFactory.createBox(gl, sx, sy, sz);
      rock.material = mats.stone;
      rock.setPosition(rx, ry, rz);
      this.addChild(rock);
    }

    // 4. Pipa Nozzle & Semburan Air Mancur Dinamis (Water Jets)
    // Semburan di sepanjang pinggir kolam
    const jetZList = [centerZ - 5, centerZ - 2, centerZ + 1, centerZ + 4, centerZ + 6.5];
    for (let i = 0; i < jetZList.length; i++) {
      const jz = jetZList[i];
      // Sisi kiri
      this.addWaterJet(-2.5, jz, (i * 2));
      // Sisi kanan
      this.addWaterJet( 2.5, jz, (i * 2 + 1));
    }
  }

  addWaterJet(x, z, phaseIndex) {
    const gl = this.gl;
    const mats = this.materials;

    const jetNode = new SceneNode(`WaterJet_${this.waterJets.length}`);
    jetNode.geometry = GeometryFactory.createCylinder(gl, 0.06, 1.6, 8);
    jetNode.material = mats.waterJet;
    jetNode.setPosition(x, 0.85, z);

    // Sedikit condong ke arah tengah kolam
    const tilt = x < 0 ? -0.15 : 0.15;
    jetNode.setRotation(0, 0, tilt);

    this.addChild(jetNode);
    this.waterJets.push({
      node: jetNode,
      phase: phaseIndex * 0.7
    });
  }

  // Animasi Air Mancur
  animate(time) {
    if (this.waterSurface) {
      const ripple = Math.sin(time * 3.0) * 0.008;
      this.waterSurface.setPosition(0, 0.04 + ripple, 4.5);
    }

    for (let i = 0; i < this.waterJets.length; i++) {
      const item = this.waterJets[i];
      const pulse = Math.sin(time * 4.0 + item.phase) * 0.35 + 0.9;
      item.node.setScale(1.0, pulse, 1.0);
    }
  }
}

class RoadSystem extends SceneNode {
  constructor(gl, materials) {
    super("RoadSystem");
    this.gl = gl;
    this.materials = materials;

    this.buildRoads();
  }

  buildRoads() {
    const gl = this.gl;
    const mats = this.materials;

    // 1. Jalan Utama di Depan Porch / Area Drop-off
    const frontRoad = new SceneNode("FrontPorchRoad");
    frontRoad.geometry = GeometryFactory.createBox(gl, 30.99, 0.05, 5.0, 6, 1);
    frontRoad.material = mats.pavement;
    frontRoad.setPosition(0, 0.02, -10.1);
    this.addChild(frontRoad);

    // 2. Jalur Jalan Melintang di Depan Kolam & Luar Barisan Pohon
    const outerRoad = new SceneNode("OuterPoolRoad");
    outerRoad.geometry = GeometryFactory.createBox(gl, 30.99, 0.05, 6.0, 10, 1);
    outerRoad.material = mats.pavement;
    outerRoad.setPosition(0, 0.02, 22.0);
    this.addChild(outerRoad);

    // 3. Jalur Penghubung di Samping Kiri & Kanan Kolam (di luar barisan pohon)
    const sideRoadLeft = new SceneNode("SideRoadLeft");
    sideRoadLeft.geometry = GeometryFactory.createBox(gl, 5.0, 0.05, 44.0, 1, 4);
    sideRoadLeft.material = mats.pavement;
    sideRoadLeft.setPosition(-18.0, 0.02, 9.5);
    this.addChild(sideRoadLeft);

    const sideRoadRight = new SceneNode("SideRoadRight");
    sideRoadRight.geometry = GeometryFactory.createBox(gl, 5.0, 0.05, 44.0, 1, 4);
    sideRoadRight.material = mats.pavement;
    sideRoadRight.setPosition(18.0, 0.02, 9.5);
    this.addChild(sideRoadRight);
  }
}

class RektoratSign extends SceneNode {
  constructor(gl, materials, customMaterial) {
    super("RektoratSign");
    this.gl = gl;
    this.materials = materials;
    this.customMaterial = customMaterial || materials.metal;

    this.buildSign();
  }

  buildSign() {
    const gl = this.gl;
    const matToUse = this.customMaterial;
    const startX = -6.2;
    const startZ = 1.5; // Mengikuti posisi Z alas beton
    const spacing = 0.95;
    const hDepth = 0.2; // Ketebalan 3D huruf

    // --- HURUF 1: R ---
    const rGroup = new SceneNode("Letter_R");
    rGroup.setPosition(startX + (0 * spacing), 0.45, startZ);
    
    const rStem = new SceneNode("R_Stem");
    rStem.geometry = GeometryFactory.createBox(gl, 0.16, 1.0, hDepth);
    rStem.material = matToUse;
    rStem.setPosition(-0.25, 0.5, 0);
    rGroup.addChild(rStem);

    const rLoop = new SceneNode("R_Loop");
    rLoop.geometry = GeometryFactory.createBox(gl, 0.32, 0.15, hDepth);
    rLoop.material = matToUse;
    rLoop.setPosition(-0.05, 0.85, 0);
    rGroup.addChild(rLoop);

    const rTopRight = new SceneNode("R_TopRight");
    rTopRight.geometry = GeometryFactory.createBox(gl, 0.15, 0.5, hDepth);
    rTopRight.material = matToUse;
    rTopRight.setPosition(0.1, 0.68, 0);
    rGroup.addChild(rTopRight);

    const rMid = new SceneNode("R_Mid");
    rMid.geometry = GeometryFactory.createBox(gl, 0.3, 0.15, hDepth);
    rMid.material = matToUse;
    rMid.setPosition(-0.05, 0.5, 0);
    rGroup.addChild(rMid);

    const rLeg = new SceneNode("R_Leg");
    rLeg.geometry = GeometryFactory.createBox(gl, 0.15, 0.55, hDepth);
    rLeg.material = matToUse;
    rLeg.setPosition(0.08, 0.22, 0);
    rLeg.setRotation(0, 0, 0.45);
    rGroup.addChild(rLeg);
    this.addChild(rGroup);

    // --- HURUF 2: E ---
    const eGroup = new SceneNode("Letter_E");
    eGroup.setPosition(startX + (1 * spacing), 0.45, startZ);
    
    const eStem = new SceneNode("E_Stem");
    eStem.geometry = GeometryFactory.createBox(gl, 0.16, 1.0, hDepth);
    eStem.material = matToUse;
    eStem.setPosition(-0.22, 0.5, 0);
    eGroup.addChild(eStem);

    const eTop = new SceneNode("E_Top");
    eTop.geometry = GeometryFactory.createBox(gl, 0.4, 0.15, hDepth);
    eTop.material = matToUse;
    eTop.setPosition(-0.02, 0.92, 0);
    eGroup.addChild(eTop);

    const eMid = new SceneNode("E_Mid");
    eMid.geometry = GeometryFactory.createBox(gl, 0.35, 0.15, hDepth);
    eMid.material = matToUse;
    eMid.setPosition(-0.04, 0.5, 0);
    eGroup.addChild(eMid);

    const eBot = new SceneNode("E_Bot");
    eBot.geometry = GeometryFactory.createBox(gl, 0.4, 0.15, hDepth);
    eBot.material = matToUse;
    eBot.setPosition(-0.02, 0.08, 0);
    eGroup.addChild(eBot);
    this.addChild(eGroup);

    // --- HURUF 3: K ---
    const kGroup = new SceneNode("Letter_K");
    kGroup.setPosition(startX + (2 * spacing), 0.45, startZ);
    
    const kStem = new SceneNode("K_Stem");
    kStem.geometry = GeometryFactory.createBox(gl, 0.16, 1.0, hDepth);
    kStem.material = matToUse;
    kStem.setPosition(-0.25, 0.5, 0);
    kGroup.addChild(kStem);

    const kUpper = new SceneNode("K_Upper");
    kUpper.geometry = GeometryFactory.createBox(gl, 0.15, 0.6, hDepth);
    kUpper.material = matToUse;
    kUpper.setPosition(0.1, 0.72, 0);
    kUpper.setRotation(0, 0, -0.65);
    kGroup.addChild(kUpper);

    const kLower = new SceneNode("K_Lower");
    kLower.geometry = GeometryFactory.createBox(gl, 0.15, 0.6, hDepth);
    kLower.material = matToUse;
    kLower.setPosition(0.1, 0.28, 0);
    kLower.setRotation(0, 0, 0.65);
    kGroup.addChild(kLower);
    this.addChild(kGroup);

    // --- HURUF 4: T (Pertama) ---
    const t1Group = new SceneNode("Letter_T1");
    t1Group.setPosition(startX + (3 * spacing), 0.45, startZ);
    
    const t1Stem = new SceneNode("T1_Stem");
    t1Stem.geometry = GeometryFactory.createBox(gl, 0.16, 1.0, hDepth);
    t1Stem.material = matToUse;
    t1Stem.setPosition(0, 0.5, 0);
    t1Group.addChild(t1Stem);

    const t1Top = new SceneNode("T1_Top");
    t1Top.geometry = GeometryFactory.createBox(gl, 0.68, 0.15, hDepth);
    t1Top.material = matToUse;
    t1Top.setPosition(0, 0.92, 0);
    t1Group.addChild(t1Top);
    this.addChild(t1Group);

    // --- HURUF 5: O ---
    const oGroup = new SceneNode("Letter_O");
    oGroup.setPosition(startX + (4 * spacing), 0.45, startZ);
    
    const oTop = new SceneNode("O_Top");
    oTop.geometry = GeometryFactory.createBox(gl, 0.6, 0.15, hDepth);
    oTop.material = matToUse;
    oTop.setPosition(0, 0.92, 0);
    oGroup.addChild(oTop);

    const oBot = new SceneNode("O_Bot");
    oBot.geometry = GeometryFactory.createBox(gl, 0.6, 0.15, hDepth);
    oBot.material = matToUse;
    oBot.setPosition(0, 0.08, 0);
    oGroup.addChild(oBot);

    const oLeft = new SceneNode("O_Left");
    oLeft.geometry = GeometryFactory.createBox(gl, 0.15, 0.85, hDepth);
    oLeft.material = matToUse;
    oLeft.setPosition(-0.22, 0.5, 0);
    oGroup.addChild(oLeft);

    const oRight = new SceneNode("O_Right");
    oRight.geometry = GeometryFactory.createBox(gl, 0.15, 0.85, hDepth);
    oRight.material = matToUse;
    oRight.setPosition(0.22, 0.5, 0);
    oGroup.addChild(oRight);
    this.addChild(oGroup);

    // --- HURUF 6: R (Kedua) ---
    const r2Group = new SceneNode("Letter_R2");
    r2Group.setPosition(startX + (5 * spacing), 0.45, startZ);
    
    const r2Stem = new SceneNode("R2_Stem");
    r2Stem.geometry = GeometryFactory.createBox(gl, 0.16, 1.0, hDepth);
    r2Stem.material = matToUse;
    r2Stem.setPosition(-0.25, 0.5, 0);
    r2Group.addChild(r2Stem);

    const r2Loop = new SceneNode("R2_Loop");
    r2Loop.geometry = GeometryFactory.createBox(gl, 0.32, 0.15, hDepth);
    r2Loop.material = matToUse;
    r2Loop.setPosition(-0.05, 0.85, 0);
    r2Group.addChild(r2Loop);

    const r2TopRight = new SceneNode("R2_TopRight");
    r2TopRight.geometry = GeometryFactory.createBox(gl, 0.15, 0.5, hDepth);
    r2TopRight.material = matToUse;
    r2TopRight.setPosition(0.1, 0.68, 0);
    r2Group.addChild(r2TopRight);

    const r2Mid = new SceneNode("R2_Mid");
    r2Mid.geometry = GeometryFactory.createBox(gl, 0.3, 0.15, hDepth);
    r2Mid.material = matToUse;
    r2Mid.setPosition(-0.05, 0.5, 0);
    r2Group.addChild(r2Mid);

    const r2Leg = new SceneNode("R2_Leg");
    r2Leg.geometry = GeometryFactory.createBox(gl, 0.15, 0.55, hDepth);
    r2Leg.material = matToUse;
    r2Leg.setPosition(0.08, 0.22, 0);
    r2Leg.setRotation(0, 0, 0.45);
    r2Group.addChild(r2Leg);
    this.addChild(r2Group);

    // --- HURUF 7: A ---
    const aGroup = new SceneNode("Letter_A");
    aGroup.setPosition(startX + (6 * spacing), 0.45, startZ);
    
    const aLeft = new SceneNode("A_Left");
    aLeft.geometry = GeometryFactory.createBox(gl, 0.15, 1.02, hDepth);
    aLeft.material = matToUse;
    aLeft.setPosition(-0.16, 0.5, 0);
    aLeft.setRotation(0, 0, -0.22);
    aGroup.addChild(aLeft);

    const aRight = new SceneNode("A_Right");
    aRight.geometry = GeometryFactory.createBox(gl, 0.15, 1.02, hDepth);
    aRight.material = matToUse;
    aRight.setPosition(0.16, 0.5, 0);
    aRight.setRotation(0, 0, 0.22);
    aGroup.addChild(aRight);

    const aMid = new SceneNode("A_Mid");
    aMid.geometry = GeometryFactory.createBox(gl, 0.38, 0.15, hDepth);
    aMid.material = matToUse;
    aMid.setPosition(0, 0.48, 0);
    aGroup.addChild(aMid);

    const aTop = new SceneNode("A_Top");
    aTop.geometry = GeometryFactory.createBox(gl, 0.28, 0.15, hDepth);
    aTop.material = matToUse;
    aTop.setPosition(0, 0.92, 0);
    aGroup.addChild(aTop);
    this.addChild(aGroup);

    // --- HURUF 8: T (Kedua) ---
    const t2Group = new SceneNode("Letter_T2");
    t2Group.setPosition(startX + (7 * spacing), 0.45, startZ);
    
    const t2Stem = new SceneNode("T2_Stem");
    t2Stem.geometry = GeometryFactory.createBox(gl, 0.16, 1.0, hDepth);
    t2Stem.material = matToUse;
    t2Stem.setPosition(0, 0.5, 0);
    t2Group.addChild(t2Stem);

    const t2Top = new SceneNode("T2_Top");
    t2Top.geometry = GeometryFactory.createBox(gl, 0.68, 0.15, hDepth);
    t2Top.material = matToUse;
    t2Top.setPosition(0, 0.92, 0);
    t2Group.addChild(t2Top);
    this.addChild(t2Group);
  }
}

class RektoratSignOnWalkway extends SceneNode {
  constructor(gl, materials) {
    super("RektoratSignOnWalkway");
    this.gl = gl;
    this.materials = materials;

    this.buildDetailed3DSign();
  }

  buildDetailed3DSign() {
    const gl = this.gl;
    const mats = this.materials;

    this.setScale(0.35, 0.35, 0.35);

    const sign = new RektoratSign(gl, mats, mats.walkwaySign);
    sign.setPosition(0, 0, 0);
    this.addChild(sign);

    const baseWall = new SceneNode("SignBaseWall");
    baseWall.geometry = GeometryFactory.createBox(gl, 8.8, 0.45, 0.6);
    baseWall.material = mats.concrete;
    baseWall.setPosition(-3.2, 0.22, 1.5);
    this.addChild(baseWall);

  }
}

class ConnectingWalkway extends SceneNode {
  constructor(gl, materials) {
    super("ConnectingWalkway");
    this.gl = gl;
    this.materials = materials;

    this.buildWalkway();
  }

  buildWalkway() {
    const gl = this.gl;
    const mats = this.materials;

    const walkway = new SceneNode("MainWalkway");
    walkway.geometry = GeometryFactory.createBox(gl, 9.2, 0.06, 4.0, 4, 1);
    walkway.material = mats.concrete; // Menggunakan material beton/concrete
    
    walkway.setPosition(0, 0.05, 17.00); 
    this.addChild(walkway);

    const rektoratSignPost = new RektoratSignOnWalkway(gl, mats);
    // Letakkan di tengah atas concrete penghubung (Z disesuaikan dengan posisi walkway di 17.00)
    rektoratSignPost.setPosition(-1.8, 0.08, 18.00);
    this.addChild(rektoratSignPost);
  }
}

class SedanCar extends SceneNode {
  constructor(gl, materials) {
    super("SedanCar");
    this.gl = gl;
    this.materials = materials;
    this.wheels = [];
    
    // Parameter untuk animasi lintasan melingkar/keliling jalan
    this.angle = 0;
    this.radiusX = 18.0; // Jarak horizontal dari pusat scene (menyesuaikan lebar jalan)
    this.radiusZ = 16.0; // Jarak vertikal dari pusat scene
    this.speed = 0.4;    // Kecepatan putar mobil

    this.buildCar();
  }

  buildCar() {
    const gl = this.gl;
    // Buat material khusus untuk bodi sedan hitam mengkilap
    const blackBodyMat = new Material({
      color: [0.1, 0.1, 0.12, 1.0],
      specularShininess: 64.0,
      specularIntensity: 0.9
    });

    // Material kaca jendela (kebiruan transparan / gelap)
    const glassMat = new Material({
      color: [0.2, 0.25, 0.3, 0.85],
      specularShininess: 90.0,
      specularIntensity: 0.95
    });

    // Material velg & roda
    const tireMat = new Material({
      color: [0.15, 0.15, 0.15, 1.0],
      specularShininess: 16.0,
      specularIntensity: 0.2
    });

    // 1. Badan Utama Mobil (Bawah / Sedan Body)
    const bodyLower = new SceneNode("BodyLower");
    bodyLower.geometry = GeometryFactory.createBox(gl, 2.0, 0.6, 4.2);
    bodyLower.material = blackBodyMat;
    bodyLower.setPosition(0, 0.5, 0);
    this.addChild(bodyLower);

    // 2. Kabin Atas / Kaca (Cabin Top)
    const cabin = new SceneNode("Cabin");
    cabin.geometry = GeometryFactory.createBox(gl, 1.7, 0.55, 2.2);
    cabin.material = glassMat;
    cabin.setPosition(0, 0.57, -0.1);
    bodyLower.addChild(cabin);

    // 3. Roda Mobil (4 Roda) & Velg
    const wheelOffsets = [
      [-1.05, -0.2,  1.3], // Depan Kiri
      [ 1.05, -0.2,  1.3], // Depan Kanan
      [-1.05, -0.2, -1.3], // Belakang Kiri
      [ 1.05, -0.2, -1.3]  // Belakang Kanan
    ];

    for (let i = 0; i < wheelOffsets.length; i++) {
      const [wx, wy, wz] = wheelOffsets[i];
      const wheelGroup = new SceneNode(`Wheel_${i}`);
      wheelGroup.setPosition(wx, wy, wz);

      // Ban silinder (diputar 90 derajat agar menghadap ke samping)
      const tire = new SceneNode(`Tire_${i}`);
      tire.geometry = GeometryFactory.createCylinder(gl, 0.35, 0.25, 12);
      tire.material = tireMat;
      tire.setRotation(0, 0, Math.PI / 2);
      wheelGroup.addChild(tire);

      bodyLower.addChild(wheelGroup);
      this.wheels.push(tire);
    }
  }

  // Animasi mengelilingi jalan & putaran roda
  animate(time, deltaTime) {
    // Perbarui sudut posisi mobil mengitari area rektorat
    this.angle += this.speed * deltaTime;

    // Hitung posisi X dan Z berdasarkan lintasan elips/lingkar jalan
    const x = Math.cos(this.angle) * this.radiusX;
    const z = Math.sin(this.angle) * this.radiusZ + 6.0; // Sesuaikan pusat Z dengan area jalan
    this.setPosition(x, 0.1, z);

    // Hitung arah rotasi menghadap ke arah jalannya mobil (tangent dari lingkaran)
    const yawAngle = -this.angle - Math.PI / 2;
    this.setRotation(0, yawAngle, 0);

    // Animasi putaran roda saat mobil berjalan
    // for (let i = 0; i < this.wheels.length; i++) {
    //   const wheel = this.wheels[i];
    //   const currentRot = wheel.rotation;
    //   wheel.setRotation(currentRot[0] + deltaTime * 8.0, currentRot[1], currentRot[2]);
    // }
  }
}

class Environment extends SceneNode {
  constructor(gl, materials) {
    super("Environment");
    this.gl = gl;
    this.materials = materials;

    this.buildRoads();
    this.buildWalkways();
    this.buildTerrain();
  }

  buildRoads() {
    const roadSystem = new RoadSystem(this.gl, this.materials);
    this.addChild(roadSystem);
  }

  buildWalkways() {
    const walkway = new ConnectingWalkway(this.gl, this.materials);
    this.addChild(walkway);
  }

  buildTerrain() {
    const gl = this.gl;
    const mats = this.materials;

    // 1. Hamparan Rumput Hijau Luas (Grass Lawn)
    const ground = new SceneNode("GrassGround");
    ground.geometry = GeometryFactory.createPlane(gl, 70.0, 70.0, 10, 10);
    ground.material = mats.grass;
    ground.setPosition(0, 0, 0);
    this.addChild(ground);

    // 2. Barisan Pepohonan Rindang Membingkai Sisi Kiri & Kanan (Sesuai Foto Asli)
    const treePositions = [
      // Sisi Kiri
      [-6.5, 11.0], [-6.8, 7.5], [-7.2, 3.5], [-7.6, -0.5], [-8.2, -4.5],
      [-7.0, 14.5], [-7.4, 18.0],
      [-9.2, 9.5],  [-9.6, 5.5], [-10.0, 1.5], [-10.4, -2.5],
      [-9.8, 13.5], [-10.2, 17.0],

      // Sisi Kanan
      [ 6.5, 11.0], [ 6.8, 7.5], [ 7.2, 3.5], [ 7.6, -0.5], [ 8.2, -4.5],
      [ 7.0, 14.5], [ 7.4, 18.0],
      [ 9.2, 9.5],  [ 9.6, 5.5], [ 10.0, 1.5], [ 10.4, -2.5],
      [ 9.8, 13.5], [ 10.2, 17.0]
    ];

    for (let i = 0; i < treePositions.length; i++) {
      const [tx, tz] = treePositions[i];
      const tree = this.createTree(gl, mats);
      tree.setPosition(tx, 0, tz);
      this.addChild(tree);
    }
  }

  createTree(gl, mats) {
    const treeRoot = new SceneNode("Tree");

    // Batang pohon cokelat
    const trunk = new SceneNode("Trunk");
    trunk.geometry = GeometryFactory.createCylinder(gl, 0.3, 2.6, 12);
    trunk.material = mats.wood;
    trunk.setPosition(0, 1.3, 0);
    treeRoot.addChild(trunk);

    // Dedaunan rimbun bertingkat hijau segar
    const foliageLower = new SceneNode("FoliageLower");
    foliageLower.geometry = GeometryFactory.createPyramid(gl, 3.6, 3.6, 2.6);
    foliageLower.material = mats.foliage;
    foliageLower.setPosition(0, 2.2, 0);
    treeRoot.addChild(foliageLower);

    const foliageUpper = new SceneNode("FoliageUpper");
    foliageUpper.geometry = GeometryFactory.createPyramid(gl, 2.6, 2.6, 2.2);
    foliageUpper.material = mats.foliage;
    foliageUpper.setPosition(0, 3.7, 0);
    treeRoot.addChild(foliageUpper);

    return treeRoot;
  }
}
