/**
 * Camera & OrbitCameraController (OOP)
 * Mengelola matriks proyeksi perspektif, matriks view (lookAt),
 * interaksi mouse pengguna, serta sudut pandang kamera preset.
 */
class Camera {
  constructor(fov = 45, aspect = 1.333, near = 0.1, far = 100.0) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;

    this.projectionMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    this.viewProjectionMatrix = mat4.create();

    this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    mat4.perspective(
      this.projectionMatrix,
      (this.fov * Math.PI) / 180,
      this.aspect,
      this.near,
      this.far
    );
  }

  setAspect(aspect) {
    this.aspect = aspect;
    this.updateProjectionMatrix();
  }

  getViewProjectionMatrix() {
    mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
    return this.viewProjectionMatrix;
  }
}

class OrbitCameraController extends Camera {
  constructor(canvas) {
    super(45, canvas.width / canvas.height, 0.1, 150.0);
    this.canvas = canvas;

    // Parameter orbit
    this.target = [0, 2.5, 0];
    this.distance = 24.0;
    this.pitch = 0.08; // Sedikit mendongak seperti sudut pandang mata foto asli
    this.yaw = 0.0;    // Tepat menghadap lurus ke depan gedung Rektorat

    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.eye = [0, 0, 0];

    this.setupEventListeners();
    this.updateViewMatrix();
  }

  setupEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;

      this.yaw += dx * 0.008;
      this.pitch += dy * 0.008;

      // Batasi pitch agar kamera tidak jungkir balik
      const limit = Math.PI / 2 - 0.05;
      this.pitch = Math.max(-0.2, Math.min(limit, this.pitch));

      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.updateViewMatrix();
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.distance += e.deltaY * 0.02;
      this.distance = Math.max(5.0, Math.min(70.0, this.distance));
      this.updateViewMatrix();
    }, { passive: false });
  }

  updateViewMatrix() {
    const eyeX = this.target[0] + this.distance * Math.cos(this.pitch) * Math.sin(this.yaw);
    const eyeY = this.target[1] + this.distance * Math.sin(this.pitch);
    const eyeZ = this.target[2] + this.distance * Math.cos(this.pitch) * Math.cos(this.yaw);

    this.eye = [eyeX, eyeY, eyeZ];
    mat4.lookAt(this.viewMatrix, this.eye, this.target, [0, 1, 0]);
  }

  // Presets kamera untuk kemudahan presentasi
  setPreset(presetName) {
    if (presetName === 'real-photo') {
      // Sudut pandang persis sejajar dengan foto asli
      this.target = [0, 2.7, -7.5];
      this.distance = 22.5;
      this.pitch = 0.05;
      this.yaw = 0.0;
    } else if (presetName === 'overview') {
      // Perspektif 3/4 miring untuk melihat seluruh scene
      this.target = [0, 2.0, 0];
      this.distance = 28.0;
      this.pitch = 0.45;
      this.yaw = 0.65;
    } else if (presetName === 'top-down') {
      // Tampak atas untuk memperlihatkan layout kolam dan taman
      this.target = [0, 0, 2.0];
      this.distance = 32.0;
      this.pitch = 1.35;
      this.yaw = 0.0;
    }
    this.updateViewMatrix();
  }

  reset() {
    this.setPreset('real-photo');
  }
}
