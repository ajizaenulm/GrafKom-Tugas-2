/**
 * App - Main Application Controller
 * Menggabungkan seluruh komponen: Shader, Camera, Scene Graph, Objects,
 * Lighting, dan Animation Loop.
 */

// Shaders GLSL (Phong Lighting Model + Multi-Texture)
const vertexShaderSource = `
  attribute vec3 aPosition;
  attribute vec3 aNormal;
  attribute vec2 aTexCoord;

  uniform mat4 uModelMatrix;
  uniform mat4 uViewProjectionMatrix;
  uniform mat3 uNormalMatrix;

  varying vec3 vNormal;
  varying vec3 vFragPos;
  varying vec2 vTexCoord;

  void main() {
    vec4 worldPos = uModelMatrix * vec4(aPosition, 1.0);
    vFragPos = worldPos.xyz;
    vNormal = normalize(uNormalMatrix * aNormal);
    vTexCoord = aTexCoord;
    gl_Position = uViewProjectionMatrix * worldPos;
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec3 vNormal;
  varying vec3 vFragPos;
  varying vec2 vTexCoord;

  uniform sampler2D uSampler;
  uniform vec4 uColor;
  uniform int uUseTexture;

  // Pencahayaan Phong
  uniform vec3 uLightDirection;
  uniform vec3 uLightColor;
  uniform vec3 uAmbientLight;
  uniform vec3 uViewPos;
  uniform float uShininess;
  uniform float uSpecularIntensity;

  void main() {
    vec4 texColor = vec4(1.0);
    if (uUseTexture == 1) {
      texColor = texture2D(uSampler, vTexCoord);
    }
    vec4 baseColor = uColor * texColor;

    // Normalisasi vektor
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(uLightDirection);

    // 1. Ambient Lighting
    vec3 ambient = uAmbientLight * baseColor.rgb;

    // 2. Diffuse Lighting (Lambertian)
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * uLightColor * baseColor.rgb;

    // 3. Specular Lighting (Phong)
    vec3 viewDir = normalize(uViewPos - vFragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
    vec3 specular = spec * uLightColor * uSpecularIntensity;

    vec3 finalColor = ambient + diffuse + specular;
    gl_FragColor = vec4(finalColor, baseColor.a);
  }
`;

class App {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.gl = this.canvas.getContext('webgl');

    if (!this.gl) {
      alert('Browser Anda tidak mendukung WebGL');
      throw new Error('WebGL tidak didukung');
    }

    this.isAnimating = true;
    this.isDayMode = true;
    this.elapsedTime = 0;
    this.lastTime = 0;

    this.initGL();
    this.initShader();
    this.initMaterials();
    this.initScene();
    this.initCamera();
    this.initUI();

    // Jalankan render loop
    requestAnimationFrame(this.renderLoop.bind(this));
  }

  initGL() {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  }

  initShader() {
    this.shader = new ShaderProgram(this.gl, vertexShaderSource, fragmentShaderSource);
  }

  initMaterials() {
    const gl = this.gl;

    // Textures
    const texRoof = new Texture(gl, 'assets/images/textures/roof.jpg');
    const texFacade = new Texture(gl, 'assets/images/textures/facade.jpg');
    const texSign = new Texture(gl, 'assets/images/textures/rektorat_sign.png');
    const texWater = new Texture(gl, 'assets/images/textures/water.jpg');
    const texPave = new Texture(gl, 'assets/images/textures/pavement.jpg');
    const texWood = new Texture(gl, 'assets/images/textures/wood.jpg');
    const texGrass = new Texture(gl, 'assets/images/textures/grass.jpg');
    const texFlag = new Texture(gl, 'assets/images/textures/flag.png');

    // Material definitions
    this.materials = {
      roof: new Material({ color: [1.0, 1.0, 1.0, 1.0], texture: texRoof, specularShininess: 24, specularIntensity: 0.3 }),
      facade: new Material({ color: [1.0, 1.0, 1.0, 1.0], texture: texFacade, specularShininess: 32, specularIntensity: 0.35 }),
      rektoratSign: new Material({ color: [1.0, 1.0, 1.0, 1.0], texture: texSign, specularShininess: 64, specularIntensity: 0.5 }),
      water: new Material({ color: [0.85, 1.0, 0.92, 1.0], texture: texWater, specularShininess: 90, specularIntensity: 0.9 }),
      waterJet: new Material({ color: [0.95, 0.98, 1.0, 0.9], specularShininess: 96, specularIntensity: 0.95 }),
      pavement: new Material({ color: [0.95, 0.95, 0.95, 1.0], texture: texPave, specularShininess: 8, specularIntensity: 0.1 }),
      wood: new Material({ color: [1.0, 1.0, 1.0, 1.0], texture: texWood, specularShininess: 16, specularIntensity: 0.15 }),
      grass: new Material({ color: [0.85, 1.0, 0.85, 1.0], texture: texGrass, specularShininess: 6, specularIntensity: 0.08 }),
      flag: new Material({ color: [1.0, 1.0, 1.0, 1.0], texture: texFlag, specularShininess: 20, specularIntensity: 0.25 }),
      concrete: new Material({ color: [0.96, 0.97, 0.98, 1.0], specularShininess: 32, specularIntensity: 0.35 }),
      metal: new Material({ color: [0.9, 0.92, 0.95, 1.0], specularShininess: 64, specularIntensity: 0.8 }),
      gold: new Material({ color: [1.0, 0.82, 0.2, 1.0], specularShininess: 64, specularIntensity: 0.9 }),
      rim: new Material({ color: [0.76, 0.28, 0.22, 1.0], specularShininess: 24, specularIntensity: 0.25 }),
      stone: new Material({ color: [0.32, 0.35, 0.38, 1.0], specularShininess: 16, specularIntensity: 0.18 }),
      foliage: new Material({ color: [0.25, 0.62, 0.28, 1.0], specularShininess: 12, specularIntensity: 0.15 })
    };
  }

  initScene() {
    const gl = this.gl;
    const mats = this.materials;

    // Root Node (World Origin)
    this.sceneRoot = new SceneNode("SceneRoot");

    // 1. Lingkungan (Hamparan Rumput & Pepohonan Rindang Sisi Kiri-Kanan)
    this.environment = new Environment(gl, mats);
    this.sceneRoot.addChild(this.environment);

    // 2. Gedung Rektorat Utama ITS (Hierarchical Model)
    this.rektorat = new RektoratBuilding(gl, mats);
    this.rektorat.setPosition(0, 0, 0);
    this.sceneRoot.addChild(this.rektorat);

    // 3. Kolam Refleksi Persegi Panjang & Air Mancur (Fountain System)
    this.fountain = new FountainSystem(gl, mats);
    this.fountain.setPosition(0, 0, 0);
    this.sceneRoot.addChild(this.fountain);

    // 4. Tiang Bendera Merah Putih (Berdiri di depan teras gedung dan atap)
    this.flagPole = new FlagPole(gl, mats);
    this.flagPole.setPosition(0, 0, -1.8);
    this.sceneRoot.addChild(this.flagPole);
  }

  initCamera() {
    this.camera = new OrbitCameraController(this.canvas);
    this.camera.setPreset('real-photo');
  }

  initUI() {
    // Tombol Pause/Play
    const btnAnim = document.getElementById('btn-toggle-anim');
    if (btnAnim) {
      btnAnim.addEventListener('click', () => {
        this.isAnimating = !this.isAnimating;
        btnAnim.textContent = this.isAnimating ? 'Pause Animasi' : 'Play Animasi';
      });
    }

    // Tombol Reset Kamera
    const btnReset = document.getElementById('btn-reset-cam');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.camera.reset();
      });
    }

    // Tombol Toggle Siang/Malam
    const btnLight = document.getElementById('btn-toggle-light');
    if (btnLight) {
      btnLight.addEventListener('click', () => {
        this.isDayMode = !this.isDayMode;
        btnLight.textContent = this.isDayMode ? 'Mode Malam' : 'Mode Siang';
      });
    }

    // Tombol Preset Sudut Pandang
    const btnPresetPhoto = document.getElementById('btn-preset-photo');
    if (btnPresetPhoto) {
      btnPresetPhoto.addEventListener('click', () => {
        this.camera.setPreset('real-photo');
      });
    }

    const btnPresetOverview = document.getElementById('btn-preset-overview');
    if (btnPresetOverview) {
      btnPresetOverview.addEventListener('click', () => {
        this.camera.setPreset('overview');
      });
    }

    const btnPresetTop = document.getElementById('btn-preset-top');
    if (btnPresetTop) {
      btnPresetTop.addEventListener('click', () => {
        this.camera.setPreset('top-down');
      });
    }
  }

  updateLighting() {
    const gl = this.gl;
    const shader = this.shader;

    if (this.isDayMode) {
      // Langit biru cerah khas Surabaya/ITS sesuai foto asli
      gl.clearColor(0.52, 0.74, 0.96, 1.0);
      shader.setVec3('uLightDirection', [0.6, 1.5, 0.8]);
      shader.setVec3('uLightColor', [1.0, 0.98, 0.94]);
      shader.setVec3('uAmbientLight', [0.48, 0.48, 0.52]);
    } else {
      // Malam hari dengan pencahayaan temaram
      gl.clearColor(0.04, 0.06, 0.12, 1.0);
      shader.setVec3('uLightDirection', [-0.5, 1.0, 0.5]);
      shader.setVec3('uLightColor', [0.6, 0.7, 0.9]);
      shader.setVec3('uAmbientLight', [0.15, 0.15, 0.22]);
    }

    shader.setVec3('uViewPos', this.camera.eye);
  }

  renderLoop(timestamp) {
    if (!this.lastTime) this.lastTime = timestamp;
    const deltaTime = (timestamp - this.lastTime) * 0.001;
    this.lastTime = timestamp;

    if (this.isAnimating) {
      this.elapsedTime += deltaTime;

      // Update animasi pada objek hierarki
      if (this.flagPole) this.flagPole.animate(this.elapsedTime);
      if (this.fountain) this.fountain.animate(this.elapsedTime);
    }

    // Clear Canvas
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Aktifkan Shader & Update Lighting
    this.shader.use();
    this.updateLighting();

    // Hitung ViewProjection Matrix dari Kamera
    const viewProjMatrix = this.camera.getViewProjectionMatrix();

    // Update Hierarchical World Matrix & Draw Scene
    this.sceneRoot.updateWorldMatrix();
    this.sceneRoot.draw(gl, this.shader, viewProjMatrix);

    requestAnimationFrame(this.renderLoop.bind(this));
  }
}

// Inisialisasi Aplikasi saat DOM Siap
window.addEventListener('DOMContentLoaded', () => {
  window.appInstance = new App('webgl-canvas');
});
