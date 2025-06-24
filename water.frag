precision mediump float;

uniform vec3 uCameraPosition;
uniform sampler2D uScene; // simulated background
uniform vec2 uResolution;

varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  // Compute view direction
  vec3 viewDir = normalize(uCameraPosition - vWorldPos);
  vec3 norm = normalize(vNormal);

  // Fresnel term: stronger on edges
  float fresnel = pow(1.0 - dot(viewDir, norm), 3.0);

  // Fake refraction: offset UVs
  vec2 screenUV = gl_FragCoord.xy / uResolution;
  vec2 refractOffset = norm.xy * 0.02;
  vec3 bgColor = texture2D(uScene, screenUV + refractOffset).rgb;

  // Mix refraction with edge highlight
  vec3 color = mix(bgColor, vec3(0.6, 0.8, 1.0), fresnel);

  gl_FragColor = vec4(color, 0.3 + fresnel * 0.5); // transparent
}
