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
let boxGeometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3);
let cube1 = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({
  color: "#0FFAAA",
  wireframe: true
}))

let geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
  0,0,0,
  0,1,0,
  1,0,0
])
geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

const geometry1 = new THREE.BufferGeometry();
const count = 50;
const positionArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < positionArray.length; i++) {
  positionArray[i] = (Math.random() - 0.5) * 1;
}

const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
geometry1.setAttribute("position", positionAttribute);

const mesh1 = new THREE.Mesh(geometry1, new THREE.MeshBasicMaterial({
  color: "#FF0000",
  wireframe: true
}))

camera.lookAt(group.position);
scene.add(
  group.add(cube1).add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: '#FF0000',
    wireframe: true
  }))).add(mesh1)
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