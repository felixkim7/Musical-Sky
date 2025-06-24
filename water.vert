precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec4 worldPos = uModelViewMatrix * vec4(aPosition, 1.0);
  vWorldPos = vec3(worldPos);
  vNormal = normalize(uNormalMatrix * aNormal);
  
  gl_Position = uProjectionMatrix * worldPos;
}
