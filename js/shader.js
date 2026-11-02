/**
 * ShaderProgram (OOP)
 * Mengelola kompilasi, linking shader, serta mapping uniform & attribute.
 */
class ShaderProgram {
  constructor(gl, vsSource, fsSource) {
    this.gl = gl;
    this.program = this.initProgram(vsSource, fsSource);
    this.uniformLocations = new Map();
    this.attribLocations = new Map();
  }

  initProgram(vsSource, fsSource) {
    const gl = this.gl;
    const vertexShader = this.compile(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = this.compile(fsSource, gl.FRAGMENT_SHADER);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Shader linking failed:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    return program;
  }

  compile(source, type) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  use() {
    this.gl.useProgram(this.program);
  }

  getAttribLocation(name) {
    if (!this.attribLocations.has(name)) {
      const loc = this.gl.getAttribLocation(this.program, name);
      this.attribLocations.set(name, loc);
    }
    return this.attribLocations.get(name);
  }

  getUniformLocation(name) {
    if (!this.uniformLocations.has(name)) {
      const loc = this.gl.getUniformLocation(this.program, name);
      this.uniformLocations.set(name, loc);
    }
    return this.uniformLocations.get(name);
  }

  setMat4(name, matrix) {
    const loc = this.getUniformLocation(name);
    if (loc) this.gl.uniformMatrix4fv(loc, false, matrix);
  }

  setMat3(name, matrix) {
    const loc = this.getUniformLocation(name);
    if (loc) this.gl.uniformMatrix3fv(loc, false, matrix);
  }

  setVec3(name, vec) {
    const loc = this.getUniformLocation(name);
    if (loc) this.gl.uniform3f(loc, vec[0], vec[1], vec[2]);
  }

  setVec4(name, vec) {
    const loc = this.getUniformLocation(name);
    if (loc) this.gl.uniform4f(loc, vec[0], vec[1], vec[2], vec[3]);
  }

  setFloat(name, val) {
    const loc = this.getUniformLocation(name);
    if (loc) this.gl.uniform1f(loc, val);
  }

  setInt(name, val) {
    const loc = this.getUniformLocation(name);
    if (loc) this.gl.uniform1i(loc, val);
  }
}

