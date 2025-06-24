// must always set precision
precision mediump float;

// p5.js built-in uniforms
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform vec4 uMaterialColor;

// p5.js built-in attributes
attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

// varying variables that are passed to fragment shader
varying vec3 vReflDir;

void main() {
  vec4 pos = vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * uModelViewMatrix * pos;
  // camera space position
  vec3 eyeDir = normalize(vec3(uModelViewMatrix * pos));
  // normal vector in camera space
  vec3 normal = normalize(uNormalMatrix * aNormal);
    // compute reflection direction
  vReflDir = reflect(eyeDir, normal);
}
