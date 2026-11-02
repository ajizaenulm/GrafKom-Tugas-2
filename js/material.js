/**
 * Material & Texture
 * Mengelola tekstur WebGL serta sifat permukaan material (warna, specular, shininess)
 */
class Texture {
  constructor(gl, sourceUrl = null) {
    this.gl = gl;
    this.glTexture = gl.createTexture();
    this.isLoaded = false;

    // Placeholder 1x1 abu-abu netral sebelum gambar selesai di-load
    gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
      gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([200, 200, 200, 255])
    );

    if (sourceUrl) {
      this.load(sourceUrl);
    }
  }

  load(url) {
    const gl = this.gl;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

      // Cek apakah dimensi power of 2 untuk mipmapping
      if (this.isPowerOf2(img.width) && this.isPowerOf2(img.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      this.isLoaded = true;
    };
    img.onerror = () => {
      console.warn(`[Texture] Gagal memuat gambar: ${url}, menggunakan warna dasar.`);
    };
    img.src = url;
  }

  bind(unit = 0) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
  }

  isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }
}

class Material {
  constructor({
    color = [1, 1, 1, 1],
    texture = null,
    specularShininess = 32.0,
    specularIntensity = 0.5,
    ambientReflectivity = 1.0
  } = {}) {
    this.color = color;
    this.texture = texture;
    this.specularShininess = specularShininess;
    this.specularIntensity = specularIntensity;
    this.ambientReflectivity = ambientReflectivity;
  }

  apply(shader) {
    shader.setVec4('uColor', this.color);
    shader.setFloat('uShininess', this.specularShininess);
    shader.setFloat('uSpecularIntensity', this.specularIntensity);

    if (this.texture) {
      this.texture.bind(0);
      shader.setInt('uSampler', 0);
      shader.setInt('uUseTexture', 1);
    } else {
      shader.setInt('uUseTexture', 0);
    }
  }
}

