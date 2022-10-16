uniform sampler2D tDiffuse;
uniform sampler2D normalMap;
varying vec2 v_uv;

void main() {
    
    vec3 normalColor = texture2D(normalMap, v_uv).xyz * 2.0 - 1.0;
    vec2 newUv = v_uv + normalColor.xy * 0.1;
    vec4 base = texture2D(tDiffuse, newUv);
    vec3 lightDirection =vec3(-1.0, 1.0, 0.0);
    lightDirection = normalize(lightDirection);

    float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);
    base.rgb += lightness * 2.0;
    gl_FragColor = base;
}