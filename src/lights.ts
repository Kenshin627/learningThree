import './style.css'
import { AmbientLight, BoxGeometry, DirectionalLight, DoubleSide, Group, HemisphereLight, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PointLight, PointLightHelper, RectAreaLight, Scene, SphereGeometry, SpotLight, SpotLightHelper, TorusGeometry, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

import * as dat from 'dat.gui';

//Config
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const canvas = document.querySelector("#container") as HTMLCanvasElement;

//Scene
const scene = new Scene();

//Camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 2000);
console.log(camera.position);
camera.position.set(0, 3, 3);
scene.add(camera);

//Controls
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.update();

//Lights
const ambientLight = new AmbientLight(0xf0f0f0, 0.1);
const directionLight = new DirectionalLight(0xf0f0f0, 0.2);
directionLight.position.set(0, 1, 0);
const pointLight = new PointLight(0x0099ff, 1.0, 10, 2);
pointLight.position.set(0, 2, 0)
const pointLightHelper = new PointLightHelper(pointLight);
const hemisphereLight = new HemisphereLight(0x0000ff, 0xff0000, 0.5);

const rectAreaLight = new RectAreaLight(0xff88972, 2.0, 1, .5);
rectAreaLight.rotation.x = Math.PI / 2;
rectAreaLight.position.y = 1;
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
const splotLight = new SpotLight(0x7812671, 1.0, .0, Math.PI / 10, 1.);
const spotLightHelper = new SpotLightHelper(splotLight);
// rectAreaLight.position.set(2, 2, 2);

// scene.add(ambientLight);
scene.add(directionLight);
// scene.add(pointLight);
scene.add(rectAreaLight);
// scene.add(splotLight);
// scene.add(spotLightHelper);
// scene.add(pointLightHelper);
scene.add(rectAreaLightHelper);
// scene.add(hemisphereLight);

//Material
const material = new MeshStandardMaterial({side: DoubleSide});
material.roughness = 0.5;

//Objects
//group
let group = new Group();
camera.lookAt(group.position);
rectAreaLight.lookAt(0, 0, 0);
scene.add(group);

//box
const boxGeometry = new BoxGeometry(1, 1, 1);
const box = new Mesh(boxGeometry, material);
camera.lookAt(box.position);
group.add(box);

//sphere
const sphereGeopemtry = new SphereGeometry(0.5, 64,64);
const sphere = new Mesh(sphereGeopemtry, material);
sphere.position.x = -1.5;
group.add(sphere);

//donut
const donutGeometry = new TorusGeometry(0.5, 0.2, 64, 32);
const donut = new Mesh(donutGeometry, material);
donut.position.x = 2.;
group.add(donut);

//Plane
const planeGeometry = new PlaneGeometry(10, 10);
const plane = new Mesh(planeGeometry, material);
plane.rotation.x = Math.PI / 2;
plane.position.y -= 1.;
group.add(plane);

//resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
})

//Renderer
const renderer = new WebGLRenderer({
    canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

//RenderLoop
const tick = () => {
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

//gui
const gui = new dat.GUI();
gui.add(rectAreaLight.position, "x").step(0.01);
gui.add(rectAreaLight.position, "y").step(0.01);
gui.add(rectAreaLight.position, "z").step(0.01);

tick();