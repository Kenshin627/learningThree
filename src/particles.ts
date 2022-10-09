import './style.css'
import { AdditiveBlending, AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, CameraHelper, Clock, ConeGeometry, DirectionalLight, Float32BufferAttribute, Fog, Group, Mesh, MeshStandardMaterial, PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, PointLight,  Points,  PointsMaterial,  RepeatWrapping, Scene, Sphere, SphereGeometry, TextureLoader, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//Config
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const canvas = document.querySelector("#container") as HTMLCanvasElement;

//Scene
const scene = new Scene();

//Camera
const camera = new PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
camera.position.set(0, 2, 2);
scene.add(camera);

//Controls
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.update();
//Lights
const ambientLight = new AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionLight = new DirectionalLight(0XFFFFFF, 1.0);
scene.add(directionLight);

//Textures
const textureLoader = new TextureLoader();
//'/assets/textures/door/color.jpg'
const particleMap = textureLoader.load('/assets/textures/particles/black/circle_04.png')

//Particles
const particleGeometry = new BufferGeometry();
const count = 20000;
const positions = new Float32Array(count * 3);
const colors=  new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
}

particleGeometry.setAttribute("position", new BufferAttribute(positions, 3));
particleGeometry.setAttribute("color", new BufferAttribute(colors, 3));

const particleMaterial = new PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    vertexColors: true,
    alphaMap: particleMap,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending
    // color: '#00f89f'
})

//Points
const points = new Points(particleGeometry, particleMaterial);
scene.add(points);


//Renderer
const renderer = new WebGLRenderer({canvas});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
//Resize
window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    renderer.setSize(size.width, size.height);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
})
const positionArray = particleGeometry.attributes.position.array;
const clock = new Clock();

const tick = () => {
    const elspsedTime = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
        const i3 = count * 3;
        const x = positionArray[i3 + 0];
        (particleGeometry.attributes.position.array as any)[i3 + 1] = Math.sin(elspsedTime + x);

    }
    
    particleGeometry.attributes.position.needsUpdate = true;
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();
//RenderLoop