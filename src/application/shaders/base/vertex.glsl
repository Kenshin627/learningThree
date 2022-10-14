uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec3 position;
attribute vec3 aColor;
attribute vec2 uv;

varying vec3 v_color;
varying vec2 v_uv;
varying float vEvalation;
uniform vec2 uFrequency;
uniform float u_time;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float evalation = sin(modelPosition.x * uFrequency.x + u_time) * 0.1;
    evalation += sin(modelPosition.y * uFrequency.y + u_time) * 0.1;
    modelPosition.z += evalation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    v_color = aColor;
    v_uv = uv;
    vEvalation = evalation;
    gl_Position = projectionPosition;
}