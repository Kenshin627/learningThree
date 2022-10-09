import './style.css'
import { AmbientLight, Clock, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Scene, SphereGeometry, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as Cannon from 'cannon';



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
camera.position.set(0, 0, 10);
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

//Objects
const sphereGeometry = new SphereGeometry(0.5, 32, 32);
const planeMaterial = new MeshStandardMaterial({color: '#111'});

const sphereMaterial = new MeshStandardMaterial({
    roughness: 0.7,
    metalness: 0,
    color: '#ddd'
})

const sphere1 = new Mesh(sphereGeometry, sphereMaterial);
sphere1.name = `sphere1`;
sphere1.position.y += 3;
const plane = new Mesh(new PlaneGeometry(10, 10), planeMaterial);
plane.rotation.x = -Math.PI * 0.5;

scene.add(sphere1, plane);
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

//Physics
const world = new Cannon.World();
world.gravity.set(0, -9.82, 0);

const defaultMaterial = new Cannon.Material("default");
const concatMaterial = new Cannon.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0,
    restitution: 1.0
})
world.defaultContactMaterial = concatMaterial;

const sphere = new Cannon.Sphere(0.5);
const sphereBody = new Cannon.Body({
    mass: 1,
    position: new Cannon.Vec3(0, 3, 0),
    shape: sphere
})
world.addBody(sphereBody);

const physicsPlane = new Cannon.Plane();
const planeBody = new Cannon.Body({
    mass: 0,
    position: new Cannon.Vec3(0,0,0),
    shape: physicsPlane
})
planeBody.quaternion.setFromAxisAngle(new Cannon.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(planeBody);

//RenderLoop
let prevTime = 0;
const clock = new Clock();
const tick = () => {
    let currentTime = clock.getElapsedTime();
    let deltaTime = currentTime - prevTime;
    prevTime  = currentTime;
    world.step(1 / 60, deltaTime, 3);
    sphere1.position.fromArray(sphereBody.position.toArray());
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();
