#version 300 es
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float u_time;
uniform float u_xFrequency;
uniform float u_yFrequency;
in vec3 position;
in vec2 uv;

out vec2 v_uv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * u_xFrequency + u_time) * 0.1;
    modelPosition.z += sin(modelPosition.y * u_yFrequency + u_time) * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    v_uv = uv;
    gl_Position = projectionPosition;
}