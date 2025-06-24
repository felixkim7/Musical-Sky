precision mediump float;

uniform sampler2D albedoMap;
uniform sampler2D aoMap;
uniform sampler2D normalMap;
uniform sampler2D roughnessMap;

uniform vec3 lightDir;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewDir;

void main() {
  // Albedo and AO
  vec3 albedo = texture2D(albedoMap, vTexCoord).rgb;
  float ao = texture2D(aoMap, vTexCoord).r;

  // Normal Mapping (tangent space assumed)
  vec3 norm = texture2D(normalMap, vTexCoord).rgb;
  norm = normalize(norm * 2.0 - 1.0);

  // Roughness
  float rough = texture2D(roughnessMap, vTexCoord).r;

  // Lighting (Blinn-Phong style approximation)
  vec3 N = normalize(norm);
  vec3 L = normalize(lightDir);
  vec3 V = normalize(vViewDir);
  vec3 H = normalize(L + V);

  float diff = max(dot(N, L), 0.0);
  float spec = pow(max(dot(N, H), 0.0), mix(1.0, 64.0, 1.0 - rough));

  vec3 color = albedo * diff + vec3(spec);
  color *= ao;

  gl_FragColor = vec4(color, 1.0);
}
