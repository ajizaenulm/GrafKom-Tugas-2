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
    mainBody.geometry = GeometryFactory.createBox(gl, 13.0, 5.4, 8.0, 2, 1);
    mainBody.material = mats.facade;
    mainBody.setPosition(0, 2.7, -7.5);
    this.addChild(mainBody);

    // 2. Sayap Kiri Gedung (Left Wing)
    const leftWing = new SceneNode("LeftWing");
    leftWing.geometry = GeometryFactory.createBox(gl, 7.5, 4.6, 7.2, 1, 1);
    leftWing.material = mats.facade;
    leftWing.setPosition(-9.8, -0.4, 0.3);
    mainBody.addChild(leftWing);

    // 3. Sayap Kanan Gedung (Right Wing)
    const rightWing = new SceneNode("RightWing");
    rightWing.geometry = GeometryFactory.createBox(gl, 7.5, 4.6, 7.2, 1, 1);
    rightWing.material = mats.facade;
    rightWing.setPosition(9.8, -0.4, 0.3);
    mainBody.addChild(rightWing);

    // 4. Pilar Kolom Vertikal Putih (Front Columns)
    const pillarX = [-4.6, -2.4, 2.4, 4.6];
    for (let i = 0; i < pillarX.length; i++) {
      const pillar = new SceneNode(`Pillar_${i}`);
      pillar.geometry = GeometryFactory.createBox(gl, 0.45, 5.2, 0.5);
      pillar.material = mats.concrete;
      pillar.setPosition(pillarX[i], -0.1, 4.1);
      mainBody.addChild(pillar);
    }

    // 5. Lobby & Pintu Masuk Bawah (Recessed Entrance Lobby)
    const lobbyGlass = new SceneNode("LobbyGlass");
    lobbyGlass.geometry = GeometryFactory.createBox(gl, 4.4, 2.4, 0.2);
    lobbyGlass.material = mats.stone;
    lobbyGlass.setPosition(0, -1.5, 4.05);
    mainBody.addChild(lobbyGlass);

    // 6. Plang Resmi Logo ITS & Tulisan REKTORAT (Fasad Tengah)
    const signBoard = new SceneNode("SignBoard");
    signBoard.geometry = GeometryFactory.createBox(gl, 4.6, 2.3, 0.15);
    signBoard.material = mats.rektoratSign;
    signBoard.setPosition(0, 0.9, 4.15);
    mainBody.addChild(signBoard);

    // 7. Atap Limasan Bertingkat Khas ITS
    // Tingkat 1: Atap Limasan Bawah (Elongated Hip Roof)
    const lowerRoof = new SceneNode("LowerTieredRoof");
    lowerRoof.geometry = GeometryFactory.createHipRoof(gl, 15.5, 9.4, 8.0, 4.8, 2.2, 3, 2);
    lowerRoof.material = mats.roof;
    lowerRoof.setPosition(0, 2.7, 0); // Duduk tepat di atas mainBody
    mainBody.addChild(lowerRoof);

    // Tingkat Tengah: Dinding Atik Menara (Attic Clerestory)
    const atticWall = new SceneNode("AtticWall");
    atticWall.geometry = GeometryFactory.createBox(gl, 7.8, 0.8, 4.6);
    atticWall.material = mats.concrete;
    atticWall.setPosition(0, 2.2 + 0.4, 0); // Menempel rapat di atas limasan bawah
    lowerRoof.addChild(atticWall);

    // Tingkat 2: Pucuk Atap Berbentuk Segitiga (Piramida Limasan Atas) Sesuai Gambar Asli!
    const upperRoof = new SceneNode("UpperTieredRoof");
    upperRoof.geometry = GeometryFactory.createPyramid(gl, 8.4, 5.2, 2.6, 2, 2);
    upperRoof.material = mats.roof;
    upperRoof.setPosition(0, 0.4, 0); // Menempel rapat di atas atticWall tanpa celah melayang
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
    pole.setPosition(0, 4.25, 0);
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
    const poolL = 17.5;   // Panjang kolam membujur
    const centerZ = 4.5;  // Titik tengah kolam pada sumbu Z

    // 1. Permukaan Air Kolam Hijau Toska
    this.waterSurface = new SceneNode("WaterSurface");
    this.waterSurface.geometry = GeometryFactory.createBox(gl, poolW - 0.2, 0.08, poolL - 0.2, 3, 5);
    this.waterSurface.material = mats.water;
    this.waterSurface.setPosition(0, 0.04, centerZ);
    this.addChild(this.waterSurface);

    // 2. Bibir / Bingkai Bata Merah Terakota (Terracotta Coping)
    const rimH = 0.18;
    const rimThick = 0.45;

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
      [ 0.0, 0.32, centerZ + 1.8, 1.5, 0.6, 1.1],
      [-0.4, 0.25, centerZ + 2.2, 0.8, 0.4, 0.8]
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
      this.addWaterJet(-3.6, jz, (i * 2));
      // Sisi kanan
      this.addWaterJet( 3.6, jz, (i * 2 + 1));
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

class Environment extends SceneNode {
  constructor(gl, materials) {
    super("Environment");
    this.gl = gl;
    this.materials = materials;

    this.buildTerrain();
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
      [-9.2, 9.5],  [-9.6, 5.5], [-10.0, 1.5], [-10.4, -2.5],
      // Sisi Kanan
      [ 6.5, 11.0], [ 6.8, 7.5], [ 7.2, 3.5], [ 7.6, -0.5], [ 8.2, -4.5],
      [ 9.2, 9.5],  [ 9.6, 5.5], [ 10.0, 1.5], [ 10.4, -2.5]
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
