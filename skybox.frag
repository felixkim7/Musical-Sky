precision mediump float;

uniform samplerCube cubeMapDay;
uniform samplerCube cubeMapNight;
uniform float mixAmount; // 0.0 = day, 1.0 = night

varying vec3 vDirection;

void main() {
    vec4 colorDay = textureCube(cubeMapDay, vDirection);
    vec4 colorNight = textureCube(cubeMapNight, vDirection);
    gl_FragColor = mix(colorDay, colorNight, mixAmount);
}
