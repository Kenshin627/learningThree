precision highp float;
varying vec2 v_uv;

void main() {
    float strengthx = mod(v_uv.x * 10.0, 1.0);
    float strengthy = mod(v_uv.y * 10.0, 1.0);

    float s = 1.0 - step(strengthx + strengthy, 0.9);
    float t = 1.0 - step(strengthy, 0.9);
    gl_FragColor = vec4(vec3(s), 1.0);
}