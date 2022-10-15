#version 300 es
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uSize;
uniform float uTime;
uniform float speed;

in vec3 position;
in vec3 color;
in float aScale;
in vec3 aRandomness;
out vec3 vColor;


void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

   /**
    * Rotation
    */
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * speed;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;
    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

   /**
    * Color
    */
    vColor = color;

   /**
    * Size
    */
    gl_PointSize = (uSize * aScale * 1.0) / -viewPosition.z;

    gl_Position = projectionPosition;
}