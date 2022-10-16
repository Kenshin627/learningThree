uniform sampler2D tDiffuse;
varying vec2 v_uv;

void main() {
    vec2 uv = vec2(
        v_uv.x + 0.01,
        v_uv.y + 0.01
    );
    vec4 base = texture2D(tDiffuse, v_uv);
    vec4 offset = texture2D(tDiffuse, uv);
    gl_FragColor = vec4(base.r, offset.g, base.b, 1.0);
}