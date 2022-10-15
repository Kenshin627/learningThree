#define PI 3.14159265358979

precision highp float;
varying vec2 v_uv;

float box(vec2 _st, vec2 center, vec2 size, float smoothEdge) {
    vec2 _size = center - size * 0.5;
    vec2 smooth = vec2(smoothEdge * 0.5);
    vec2 uv = smoothstep(_size, _size + smooth,  _st);
    uv *= smoothstep(_size, _size + smooth, vec2(1.0) - _st);
    return uv.x * uv.y;
}

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
} 

vec2 rotate(vec2 uv, float angle, vec2 rotationCenter) {
    return mat2(cos(angle),-sin(angle), sin(angle), cos(angle)) * vec2(uv.x - rotationCenter.x, uv.y - rotationCenter.y) + rotationCenter;
}

void main() {
    //Pattern 15
    // float strengthx = mod(v_uv.x * 10.0, 1.0);
    // float strengthy = mod(v_uv.y * 10.0, 1.0);

    // float s = 1.0 - step(strengthx, 0.9);
    // float s1 = strengthy > 0.3 && strengthy < 0.6 ? 0.0 : 1.0;

    // float t = 1.0 - step(strengthy, 0.9);
    // float t1 = strengthx > 0.3 && strengthx < 0.6? 0.0 : 1.0;
    // gl_FragColor = vec4(vec3(s * s1 + t * t1), 1.0);

    //Pattern 16
    // float strengthX = v_uv.x;
    // float edge = 0.5;
    // float t = abs(strengthX - edge);
    // gl_FragColor = vec4(vec3(t), 1.0);

    //Pattern 17
    // float strength = min(abs(v_uv.x - 0.5), abs(v_uv.y - 0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 18
    // float strength = max(abs(v_uv.x - 0.5), abs(v_uv.y - 0.5));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 19
    // float e = box(v_uv, vec2(0.5, 0.5), vec2(0.7, 0.7), 0.02);
    // gl_FragColor = vec4(vec3(1.0 - e), 1.0);

    //Pattern 20
    // float e = floor(v_uv.x * 9.0) / 9.0 + 0.1;
    // gl_FragColor = vec4(vec3(e), 1.0);

    //Pattern 21
    // float s = floor(v_uv.x * 10.0) / 10.0;
    // s *= floor(v_uv.y * 10.0) / 10.0;
    // gl_FragColor = vec4(vec3(s), 1.0);

    //Pattern 22
    // gl_FragColor = vec4(vec3(random(v_uv)), 1.0);

    //Pattern 23
    // vec2 uv = floor(v_uv * 10.0) / 10.0;
    // gl_FragColor = vec4(vec3(random(uv)), 1.0);

    //Pattern 24
    // vec2 uv = mat2(1.0, 1.0, 0.0, 1.0) * v_uv;
    // uv = floor(uv * 10.0) / 10.0;
    // gl_FragColor = vec4(vec3(random(uv)), 1.0);

    //Pattern 25
    // float strength = length(v_uv);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 26
    // vec2 center = vec2(0.5 ,0.5);
    // float strength = distance(v_uv, center);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 27
    // vec2 center = vec2(0.5, 0.5);
    // float strength = 1.0 - distance(v_uv, center);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 28
    // vec2 center = vec2(0.5, 0.5);
    // float strength = 1.0 - distance(v_uv, center);

    // strength = floor(strength * 20.0) / 20.0;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 29
    // vec2 center = vec2(0.5, 0.5);
    // float strength = 0.015 / distance(v_uv, center);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 30
    // vec2 uv = v_uv;
    // uv.x =  0.2 * v_uv.x + 0.4;
    // vec2 center = vec2(0.5, 0.5);
    // float strength = 0.015 / distance(uv, center);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 31
    // float angle = PI / 4.;
    // vec2 center = vec2(0.5, 0.5);
    // vec2 rotateUv = rotate(v_uv, angle, center);
    // vec2 lightUvX = vec2(
    //     rotateUv.x * 0.1 + 0.45,
    //     rotateUv.y * 0.5 + 0.25
    // );
    // float lightX = 0.015 / distance(lightUvX, center);
    
    // vec2 lightUvY =vec2(
    //     rotateUv.y * 0.1 + 0.45,
    //     rotateUv.x * 0.5 + 0.25
    // );
    // float lightY = 0.015 / distance(lightUvY, center);
    // gl_FragColor = vec4(vec3(lightY * lightX), 1.0);

    //Pattern 32
    // vec2 center = vec2(0.5);
    // float distance = distance(v_uv, center);
    // float step = 1.0 - smoothstep(distance, distance + 0.01, 0.3);
    // gl_FragColor = vec4(vec3(step), 1.0);

    //Pattern 33
    // vec2 center = vec2(0.5);
    // float strength = abs(distance(v_uv, center) - 0.25);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 34
    // vec2 center = vec2(0.5);
    // float strength = step(0.01, abs(distance(v_uv, center) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 35
    // vec2 center = vec2(0.5, 0.5);
    // float strength = 1.0 - smoothstep(0.01, 0.005 + 0.01, abs(distance(v_uv, center) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 36
    // vec2 center = vec2(0.5);
    // vec2 uv = vec2(
    //     v_uv.x,
    //     v_uv.y + sin(30.0 * v_uv.x) * 0.1
    // );
    // float strength = 1.0 - smoothstep(0.01, 0.01 + 0.005, abs(distance(uv, center) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 37
    // vec2 center = vec2(0.5);
    // vec2 uv = vec2(
    //     v_uv.x + sin(v_uv.y * 30.) * 0.1,
    //     v_uv.y + sin(v_uv.x * 30.) * 0.1
    // );

    // float strength = 1.0 - smoothstep(0.01, 0.01 + 0.005, abs(distance(uv, center) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 38
    // vec2 center = vec2(0.5);
    // vec2 uv = vec2(
    //     v_uv.x + sin(v_uv.y * 100.0) * 0.1,
    //     v_uv.y + sin(v_uv.x * 100.0) * 0.1
    // );

    // float strength = 1.0 - smoothstep(0.01, 0.01 + 0.005, abs(distance(uv, center) - 0.25));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 39
    // float strength = dot(normalize(v_uv), vec2(1.0, 0));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 40
    // float angle = atan(v_uv.x - 0.5, v_uv.y - 0.5);
    // float  strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 41
    // float angle = atan(v_uv.x - 0.5, v_uv.y - 0.5);
    // float strength = (angle + 1.) / (PI * 2.0);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 42
    // float angle = atan(v_uv.x - 0.5, v_uv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // angle *= 20.;
    // angle = mod(angle, 1.0);
    // float strength = angle;
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 43
    // float angle = atan(v_uv.x - 0.5, v_uv.y - 0.5);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float strength = sin(angle* 100.0);
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 44
    // vec2 center = vec2(0.5);
    // float radius = 0.25;
    // float angle = atan(v_uv.x - center.x, v_uv.y - center.y);
    // angle /= PI * 2.0;
    // angle += 0.5;
    // float sinusoid = sin(angle * 100.);
    // radius += sinusoid * 0.02;
    // float strength = 1.0 - smoothstep(0.01, 0.01 + 0.005, abs(distance(v_uv, center) - radius));
    // gl_FragColor = vec4(vec3(strength), 1.0);

    //Pattern 45
    
}