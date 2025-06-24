// must always set precision
precision mediump float;

//uniform variables that we set in this example
uniform samplerCube cubeMap;

// what passed into from vertex shader
varying vec3 vReflDir;

void main() {
  vec4 tc = textureCube(cubeMap, vec3(vReflDir.x, -vReflDir.y, vReflDir.z));
  
  // set final color
  gl_FragColor = vec4(tc.xyz, 1.);
}