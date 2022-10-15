#version 300 es
precision mediump float;
uniform vec3 depthColor;
uniform vec3 surfaceColor;
uniform float u_coloroffset;
uniform float u_colorMultiplier;

out vec4 fragColor;
in float v_elevation;

void main() {
    float mixStrength = (v_elevation + u_coloroffset) * u_colorMultiplier;
    vec3 mixColor = mix(depthColor, surfaceColor, mixStrength);
    fragColor = vec4(mixColor, 1.0);
}