import './style.css'
import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const scene = new THREE.Scene();

//camera
const cameraConfig = {
  fov: 75,
  width:  window.innerWidth,
  height: window.innerHeight,
  near: 0.1,
  far: 2000
}
const camera = new THREE.PerspectiveCamera(cameraConfig.fov, cameraConfig.width / cameraConfig.height, cameraConfig.near, cameraConfig.far);
camera.position.z = 2;

scene.add(camera);

//group
const group = new THREE.Group();
let cube1 = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({
  color: "#0FFAAA"
}))
camera.lookAt(group.position);
scene.add(
  group.add(cube1)
);



//Renderer
const canvas = document.querySelector("#container") as HTMLCanvasElement;

const rendererOpts: THREE.WebGLRendererParameters = {
  canvas
};
const renderer = new THREE.WebGLRenderer(rendererOpts)

renderer.setSize(cameraConfig.width, cameraConfig.height);

renderer.render(scene, camera);


//event
// const cursor = {
//   x: 0,
//   y: 0
// }
// canvas.addEventListener("mousemove", (e) => {
//   cursor.x = e.clientX / canvas.width - 0.5;
//   cursor.y = e.clientY / canvas.height - 0.5;
// })
//Controls
let control = new FirstPersonControls(camera, canvas);
let rotateControl = new OrbitControls(camera, canvas);
let clock = new THREE.Clock();
//Animation
const tick = () => {
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
  // camera.lookAt(group.position);
  control.update(clock.getDelta());
  rotateControl.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();