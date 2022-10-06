import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const scene = new THREE.Scene();
scene.background = new THREE.Color(0.5, 0.5, 0.5);
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

//resize
window.addEventListener("resize", (ev) => {
  cameraConfig.width = window.innerWidth;
  cameraConfig.height = window.innerHeight;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(cameraConfig.width, cameraConfig.height);
})

//fullscreen
window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  }else {
    document.exitFullscreen();
  }
})

//Controls
let rotateControl = new OrbitControls(camera, canvas);
rotateControl.enableDamping = true;

//Animation
const tick = () => {
  rotateControl.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();