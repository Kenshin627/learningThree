#version 300 es
precision mediump float;
in vec3 vColor;
out vec4 fragColor;

void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    dist = 1.0 - dist;
    dist = pow(dist, 10.0);
    vec3 mixColor = mix(vec3(0.0), vColor, dist);
    fragColor = vec4(mixColor, 1.0);
}