precision mediump float;
varying vec3 v_color;
varying vec2 v_uv;
varying float vEvalation;
uniform sampler2D u_texture;
void main() {
    vec3 color = texture2D(u_texture, v_uv).rgb;
    color *= (vEvalation + 1.0 ) *  .5;
    gl_FragColor = vec4(color, 1.0);
}