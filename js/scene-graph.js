/**
 * SceneNode - Inti dari Hierarchical Modelling (OOP)
 * Membangun relasi pohon (Parent - Child). Perubahan posisi/rotasi/skala
 * pada Parent secara matematis diturunkan ke seluruh Child nodes.
 */
class SceneNode {
  constructor(name = "SceneNode") {
    this.name = name;
    this.parent = null;
    this.children = [];

    // Transformasi lokal
    this.translation = [0, 0, 0];
    this.rotation = [0, 0, 0]; // [rotX, rotY, rotZ] radian
    this.scale = [1, 1, 1];

    // Matriks representasi
    this.localMatrix = mat4.create();
    this.worldMatrix = mat4.create();

    // Komponen grafis
    this.geometry = null;
    this.material = null;
    this.visible = true;
  }

  addChild(child) {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    child.parent = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parent = null;
    }
  }

  setPosition(x, y, z) {
    this.translation = [x, y, z];
    return this;
  }

  setRotation(x, y, z) {
    this.rotation = [x, y, z];
    return this;
  }

  setScale(x, y, z) {
    this.scale = [x, y, z];
    return this;
  }

  /**
   * Perhitungan Hierarchical Matrix:
   * WorldMatrix(Child) = WorldMatrix(Parent) * LocalMatrix(Child)
   */
  updateWorldMatrix() {
    mat4.identity(this.localMatrix);
    mat4.translate(this.localMatrix, this.localMatrix, this.translation);
    mat4.rotateZ(this.localMatrix, this.localMatrix, this.rotation[2]);
    mat4.rotateY(this.localMatrix, this.localMatrix, this.rotation[1]);
    mat4.rotateX(this.localMatrix, this.localMatrix, this.rotation[0]);
    mat4.scale(this.localMatrix, this.localMatrix, this.scale);

    if (this.parent) {
      mat4.multiply(this.worldMatrix, this.parent.worldMatrix, this.localMatrix);
    } else {
      mat4.copy(this.worldMatrix, this.localMatrix);
    }

    // Rekursif ke seluruh anak
    for (const child of this.children) {
      child.updateWorldMatrix();
    }
  }

  /**
   * Rendering rekursif
   */
  draw(gl, shader, viewProjMatrix) {
    if (!this.visible) return;

    if (this.geometry && this.material) {
      // Set uniform matriks
      shader.setMat4('uModelMatrix', this.worldMatrix);
      shader.setMat4('uViewProjectionMatrix', viewProjMatrix);

      // Hitung normal matrix (inverse transpose dari mat3 modelMatrix)
      const normalMat = new Float32Array([
        this.worldMatrix[0], this.worldMatrix[1], this.worldMatrix[2],
        this.worldMatrix[4], this.worldMatrix[5], this.worldMatrix[6],
        this.worldMatrix[8], this.worldMatrix[9], this.worldMatrix[10]
      ]);
      shader.setMat3('uNormalMatrix', normalMat);

      // Terapkan material & bind geometry
      this.material.apply(shader);
      this.geometry.bind(shader);
      this.geometry.draw();
    }

    // Render seluruh children
    for (const child of this.children) {
      child.draw(gl, shader, viewProjMatrix);
    }
  }

  traverse(callback) {
    callback(this);
    for (const child of this.children) {
      child.traverse(callback);
    }
  }
}
