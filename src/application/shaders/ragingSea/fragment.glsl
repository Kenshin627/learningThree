#version 300 es
precision mediump float;
// in vec3 v_color;
in vec2 v_uv;
uniform vec3 u_color;
out vec4 outColor;

void main() {

    outColor = vec4(u_color, 1.0);
}