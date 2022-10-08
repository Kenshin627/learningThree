import './style.css'
import { AmbientLight, BoxGeometry, CameraHelper, DirectionalLight, DirectionalLightHelper, DoubleSide, Group, HemisphereLight, Mesh, MeshStandardMaterial, PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, PointLight, PointLightHelper, RectAreaLight, Scene, Sphere, SphereGeometry, SpotLight, SpotLightHelper, TorusGeometry, VSMShadowMap, WebGLRenderer } from "three";

import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//Config
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const canvas = document.querySelector("#container") as HTMLCanvasElement;

//Scene
const scene = new Scene();


//Camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1 ,1000);
camera.position.set(0,2,3);
scene.add(camera);

//Controls
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.update();

//Material
const material = new MeshStandardMaterial({side: DoubleSide});
material.roughness = 0.7;
material.metalness = 0.;

//Objects
const sphereGeometry = new SphereGeometry(0.5, 32, 32);
const sphere = new Mesh(sphereGeometry, material);
sphere.castShadow = true;
scene.add(sphere);
camera.lookAt(sphere.position);

const planeGeometry = new PlaneGeometry(5, 5);
const plane = new Mesh(planeGeometry, material);
plane.receiveShadow = true;
plane.rotation.x = Math.PI / 2;
plane.position.y -= 0.5;
scene.add(plane);

//Lights
const ambientLight = new AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionLight = new DirectionalLight(0xf0f0f0, 0.2);
const directionLightHelper = new DirectionalLightHelper(directionLight);
//enable shadows
directionLight.castShadow = true;
directionLight.shadow.mapSize.set(2048, 2048);
directionLight.shadow.blurSamples = 256;
directionLight.shadow.radius = 5;

directionLight.position.set(1, 1, 0)
directionLight.lookAt(sphere.position);
// scene.add(directionLight);
// scene.add(directionLightHelper);

//spotLights
const spotLight = new SpotLight(0xffffff, 0.6, 10, Math.PI / 5, 0.6);
spotLight.castShadow = true;
spotLight.shadow.mapSize.set(1024, 1024);
spotLight.target = sphere;
spotLight.position.set(0, 2, 2);

//setSpotLightShadowCamera
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 2;
spotLight.shadow.camera.far = 2.5;
//shadowCameraHelper
const cameraHelper = new CameraHelper(spotLight.shadow.camera);
// scene.add(cameraHelper);
// scene.add(spotLight.target);
// scene.add(spotLight);

//PointLight
const pointLight = new PointLight(0xffffff, 0.5, 10, 0.1);
pointLight.position.y = 1;
pointLight.position.x = 1;
pointLight.castShadow = true;
pointLight.shadow.mapSize.set(1024, 1024);
pointLight.shadow.blurSamples = 1024;
pointLight.shadow.radius = 20;

//PointLightCamera
// pointLight.shadow.camera.fov = 100;
scene.add(pointLight);
const pointLightCameraHelper = new CameraHelper(pointLight.shadow.camera);
scene.add(pointLightCameraHelper);

//Resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

//Renderer
const renderer = new WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//enableShadows
// renderer.shadowMap.type = VSMShadowMap;
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

//RenderLoop
const tick = () => {
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();