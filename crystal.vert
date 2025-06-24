precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewDir;

void main() {
  vec4 viewPos = uModelViewMatrix * vec4(aPosition, 1.0);
  vViewDir = -viewPos.xyz;
  vNormal = normalize(uNormalMatrix * aNormal);
  vTexCoord = aTexCoord;
  gl_Position = uProjectionMatrix * viewPos;
}
