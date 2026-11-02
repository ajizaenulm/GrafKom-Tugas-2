/**
 * Geometry & GeometryFactory
 * Mengelola Vertex Buffer Objects (VBO) & Index Buffer Objects (IBO)
 * serta menyediakan pembuatan bentuk 3D parametrik: Box, Piramida/Limasan, Silinder, dan Plane.
 */
class Geometry {
  constructor(gl, positions, normals, texCoords, indices) {
    this.gl = gl;
    this.count = indices.length;

    // Position Buffer
    this.posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Normal Buffer (Untuk Lighting Phong/Lambert)
    this.normBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

    // Texture Coordinates Buffer
    this.texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

    // Index Buffer
    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  }

  bind(shader) {
    const gl = this.gl;
    const aPos = shader.getAttribLocation('aPosition');
    const aNorm = shader.getAttribLocation('aNormal');
    const aTex = shader.getAttribLocation('aTexCoord');

    if (aPos !== -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPos);
    }

    if (aNorm !== -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
      gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aNorm);
    }

    if (aTex !== -1) {
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
      gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aTex);
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  }

  draw() {
    this.gl.drawElements(this.gl.TRIANGLES, this.count, this.gl.UNSIGNED_SHORT, 0);
  }
}

class GeometryFactory {
  /**
   * Membuat Balok 3D (Box / Cuboid)
   */
  static createBox(gl, width = 1, height = 1, depth = 1, uRep = 1, vRep = 1) {
    const x = width / 2, y = height / 2, z = depth / 2;
    const positions = [
      // Depan (+Z)
      -x, -y,  z,   x, -y,  z,   x,  y,  z,  -x,  y,  z,
      // Belakang (-Z)
       x, -y, -z,  -x, -y, -z,  -x,  y, -z,   x,  y, -z,
      // Atas (+Y)
      -x,  y,  z,   x,  y,  z,   x,  y, -z,  -x,  y, -z,
      // Bawah (-Y)
      -x, -y, -z,   x, -y, -z,   x, -y,  z,  -x, -y,  z,
      // Kanan (+X)
       x, -y,  z,   x, -y, -z,   x,  y, -z,   x,  y,  z,
      // Kiri (-X)
      -x, -y, -z,  -x, -y,  z,  -x,  y,  z,  -x,  y, -z
    ];

    const normals = [
      0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
      0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1,
      0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
      0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,
      1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
     -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0
    ];

    const texCoords = [
      0,0, uRep,0, uRep,vRep, 0,vRep,
      0,0, uRep,0, uRep,vRep, 0,vRep,
      0,0, uRep,0, uRep,vRep, 0,vRep,
      0,0, uRep,0, uRep,vRep, 0,vRep,
      0,0, uRep,0, uRep,vRep, 0,vRep,
      0,0, uRep,0, uRep,vRep, 0,vRep
    ];

    const indices = [
      0, 1, 2,    0, 2, 3,
      4, 5, 6,    4, 6, 7,
      8, 9, 10,   8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23
    ];

    return new Geometry(gl, positions, normals, texCoords, indices);
  }

  /**
   * Membuat Atap Limasan Indonesia (Hip Roof / Truncated Pyramid)
   * Bentuk atap khas Gedung Rektorat ITS dengan bubungan horisontal memanjang
   */
  static createHipRoof(gl, baseW = 10, baseD = 8, topW = 4, topD = 2, height = 2, uRep = 2, vRep = 2) {
    const positions = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    function addQuad(p1, p2, p3, p4) {
      const idx = positions.length / 3;
      positions.push(...p1, ...p2, ...p3, ...p4);

      // Normal cross product (p2-p1) x (p3-p1)
      const u = [p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]];
      const v = [p3[0]-p1[0], p3[1]-p1[1], p3[2]-p1[2]];
      let nx = u[1]*v[2] - u[2]*v[1];
      let ny = u[2]*v[0] - u[0]*v[2];
      let nz = u[0]*v[1] - u[1]*v[0];
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len; ny /= len; nz /= len;

      normals.push(nx, ny, nz,  nx, ny, nz,  nx, ny, nz,  nx, ny, nz);
      texCoords.push(0, 0,  uRep, 0,  uRep, vRep,  0, vRep);
      indices.push(idx, idx+1, idx+2,  idx, idx+2, idx+3);
    }

    const bx = baseW / 2, bz = baseD / 2;
    const tx = topW / 2, tz = topD / 2;
    const h = height;

    const b1 = [-bx, 0,  bz];
    const b2 = [ bx, 0,  bz];
    const b3 = [ bx, 0, -bz];
    const b4 = [-bx, 0, -bz];

    const t1 = [-tx, h,  tz];
    const t2 = [ tx, h,  tz];
    const t3 = [ tx, h, -tz];
    const t4 = [-tx, h, -tz];

    // 4 Sisi miring
    addQuad(b1, b2, t2, t1); // Front
    addQuad(b2, b3, t3, t2); // Right
    addQuad(b3, b4, t4, t3); // Back
    addQuad(b4, b1, t1, t4); // Left

    // Puncak atas
    if (topW > 0.05 && topD > 0.05) {
      addQuad(t1, t2, t3, t4);
    }

    return new Geometry(gl, positions, normals, texCoords, indices);
  }

  /**
   * Membuat Atap Limasan / Piramida Khas Rektorat ITS
   */
  static createPyramid(gl, baseW = 1, baseD = 1, height = 1, uRep = 1, vRep = 1) {
    const x = baseW / 2, z = baseD / 2, h = height;
    const positions = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    // Helper penambah segitiga muka
    function addTriangle(p1, p2, p3) {
      const idx = positions.length / 3;
      positions.push(...p1, ...p2, ...p3);

      // Hitung normal cross product (p2-p1) x (p3-p1)
      const u = [p2[0]-p1[0], p2[1]-p1[1], p2[2]-p1[2]];
      const v = [p3[0]-p1[0], p3[1]-p1[1], p3[2]-p1[2]];
      let nx = u[1]*v[2] - u[2]*v[1];
      let ny = u[2]*v[0] - u[0]*v[2];
      let nz = u[0]*v[1] - u[1]*v[0];
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len; ny /= len; nz /= len;

      normals.push(nx, ny, nz,  nx, ny, nz,  nx, ny, nz);
      texCoords.push(0, 0,  uRep, 0,  uRep/2, vRep);
      indices.push(idx, idx+1, idx+2);
    }

    const top = [0, h, 0];
    const b1 = [-x, 0,  z];
    const b2 = [ x, 0,  z];
    const b3 = [ x, 0, -z];
    const b4 = [-x, 0, -z];

    // 4 Sisi miring limasan
    addTriangle(b1, b2, top); // Front
    addTriangle(b2, b3, top); // Right
    addTriangle(b3, b4, top); // Back
    addTriangle(b4, b1, top); // Left

    // Alas bawah
    const baseIdx = positions.length / 3;
    positions.push(-x, 0, -z,   x, 0, -z,   x, 0, z,  -x, 0, z);
    normals.push(0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0);
    texCoords.push(0,0, 1,0, 1,1, 0,1);
    indices.push(baseIdx, baseIdx+1, baseIdx+2, baseIdx, baseIdx+2, baseIdx+3);

    return new Geometry(gl, positions, normals, texCoords, indices);
  }

  /**
   * Membuat Silinder / Tabung 3D (Untuk tiang gedung, tiang bendera, lingkar kolam air mancur)
   */
  static createCylinder(gl, radius = 0.5, height = 1, segments = 24, uRep = 1, vRep = 1) {
    const positions = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    const halfH = height / 2;

    // Sisi melingkar (Tube)
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);

      const px = radius * cosTheta;
      const pz = radius * sinTheta;

      // Top vertex
      positions.push(px, halfH, pz);
      normals.push(cosTheta, 0, sinTheta);
      texCoords.push((i / segments) * uRep, 0);

      // Bottom vertex
      positions.push(px, -halfH, pz);
      normals.push(cosTheta, 0, sinTheta);
      texCoords.push((i / segments) * uRep, vRep);
    }

    for (let i = 0; i < segments; i++) {
      const i0 = i * 2;
      const i1 = i0 + 1;
      const i2 = i0 + 2;
      const i3 = i0 + 3;

      indices.push(i0, i1, i2);
      indices.push(i2, i1, i3);
    }

    return new Geometry(gl, positions, normals, texCoords, indices);
  }

  /**
   * Membuat Bidang Datar (Plane / Quad)
   */
  static createPlane(gl, width = 1, depth = 1, uRep = 1, vRep = 1) {
    const x = width / 2, z = depth / 2;
    const positions = [
      -x, 0, -z,
       x, 0, -z,
       x, 0,  z,
      -x, 0,  z
    ];

    const normals = [
      0, 1, 0,
      0, 1, 0,
      0, 1, 0,
      0, 1, 0
    ];

    const texCoords = [
      0, 0,
      uRep, 0,
      uRep, vRep,
      0, vRep
    ];

    const indices = [0, 1, 2, 0, 2, 3];

    return new Geometry(gl, positions, normals, texCoords, indices);
  }
}

