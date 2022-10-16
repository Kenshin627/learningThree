uniform sampler2D tDiffuse;
uniform float uTime;
varying vec2 v_uv;

void main() {
    vec2 newUv = vec2(
        v_uv.x,
        v_uv.y + sin(v_uv.x * 10.0 + uTime) * 0.05
    );
    vec4 base = texture2D(tDiffuse, newUv);
    gl_FragColor = base;
}