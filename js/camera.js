/**
 * Camera & OrbitCameraController
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

    // Status tombol WASD, IJKL, dan Space/Shift
    this.keys = { w: false, a: false, s: false, d: false, i: false, j: false, k: false, l: false, space: false, shift: false };
    this.moveSpeed = 15.0; // Kecepatan gerak WASD
    this.lookSpeed = 1.5;  // Kecepatan rotasi tatapan IJKL
    this.lastTime = performance.now();

    this.setupEventListeners();
    this.updateViewMatrix();
    this.startUpdateLoop();
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

    // Listener untuk WASD, IJKL, Space, Shift dan shortcut sumbu X, Y, Z
    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w') this.keys.w = true;
      if (k === 'a') this.keys.a = true;
      if (k === 's') this.keys.s = true;
      if (k === 'd') this.keys.d = true;
      if (k === 'i') this.keys.i = true;
      if (k === 'j') this.keys.j = true;
      if (k === 'k') this.keys.k = true;
      if (k === 'l') this.keys.l = true;
      if (e.code === 'Space') {
        e.preventDefault();
        this.keys.space = true;
      }
      if (e.key === 'Shift' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.keys.shift = true;

      // Shortcut X, Y, Z alignment
      if (k === 'x') {
        this.pitch = 0.0;
        this.yaw = Math.PI / 2; // Menghadap sumbu X
        this.updateViewMatrix();
      } else if (k === 'y') {
        this.pitch = Math.PI / 2 - 0.001; // Tampak atas (Top-down)
        this.yaw = 0.0;
        this.updateViewMatrix();
      } else if (k === 'z') {
        this.pitch = 0.0;
        this.yaw = 0.0; // Menghadap sumbu Z
        this.updateViewMatrix();
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w') this.keys.w = false;
      if (k === 'a') this.keys.a = false;
      if (k === 's') this.keys.s = false;
      if (k === 'd') this.keys.d = false;
      if (k === 'i') this.keys.i = false;
      if (k === 'j') this.keys.j = false;
      if (k === 'k') this.keys.k = false;
      if (k === 'l') this.keys.l = false;
      if (e.code === 'Space') this.keys.space = false;
      if (e.key === 'Shift' || e.code === 'ShiftLeft' || e.code === 'ShiftRight') this.keys.shift = false;
    });
  }

  startUpdateLoop() {
    const update = (currentTime) => {
      const deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;

      let needsUpdate = false;

      // Penanganan rotasi tatapan kamera (IJKL)
      if (this.keys.i || this.keys.k || this.keys.j || this.keys.l) {
        if (this.keys.i) this.pitch -= this.lookSpeed * deltaTime;
        if (this.keys.k) this.pitch += this.lookSpeed * deltaTime;
        if (this.keys.j) this.yaw += this.lookSpeed * deltaTime;
        if (this.keys.l) this.yaw -= this.lookSpeed * deltaTime;

        // Batasi pitch agar kamera tidak jungkir balik
        const limit = Math.PI / 2 - 0.05;
        this.pitch = Math.max(-0.2, Math.min(limit, this.pitch));
        needsUpdate = true;
      }

      // Penanganan posisi/gerak kamera (WASD & Space/Shift)
      if (this.keys.w || this.keys.s || this.keys.a || this.keys.d || this.keys.space || this.keys.shift) {
        const forwardX = Math.sin(this.yaw);
        const forwardZ = Math.cos(this.yaw);
        const rightX = Math.sin(this.yaw - Math.PI / 2);
        const rightZ = Math.cos(this.yaw - Math.PI / 2);

        let moveX = 0;
        let moveY = 0;
        let moveZ = 0;

        if (this.keys.w) {
          moveX -= forwardX;
          moveZ -= forwardZ;
        }
        if (this.keys.s) {
          moveX += forwardX;
          moveZ += forwardZ;
        }
        if (this.keys.a) {
          moveX += rightX;
          moveZ += rightZ;
        }
        if (this.keys.d) {
          moveX -= rightX;
          moveZ -= rightZ;
        }
        if (this.keys.space) {
          moveY += 1;
        }
        if (this.keys.shift) {
          moveY -= 1;
        }

        const len = Math.hypot(moveX, moveZ);
        if (len > 0) {
          moveX /= len;
          moveZ /= len;
        }

        const step = this.moveSpeed * deltaTime;
        this.target[0] += moveX * step;
        this.target[1] += moveY * step;
        this.target[2] += moveZ * step;
        needsUpdate = true;
      }

      if (needsUpdate) {
        this.updateViewMatrix();
      }

      requestAnimationFrame(update);
    };
    requestAnimationFrame((t) => {
      this.lastTime = t;
      update(t);
    });
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
