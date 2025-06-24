precision mediump float;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;

varying vec3 vDirection;

void main() {
  // Keep direction for fragment shader
  vDirection = vec3(aPosition.x, -aPosition.y, aPosition.z);

  // Remove translation from camera, keep rotation only
  vec4 pos = uProjectionMatrix * mat4(mat3(uModelViewMatrix)) * vec4(aPosition, 1.0);

  // Force skybox to be rendered at infinity (far away)
  gl_Position = pos.xyww;
}
