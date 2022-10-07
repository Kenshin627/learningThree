import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import * as dat from 'dat.gui';

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

//GUI Parameters
const parameters = {
  color: 0xff0000,
  spin: () => {
    console.log(`spin`);
    gsap.to(cube1.rotation, { duration: 1, y: cube1.rotation.y + Math.PI })
  }
}

//group
const group = new THREE.Group();
let boxGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
let cube1 = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({
  color: parameters.color,
  wireframe: false
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

//GUI
const gui  = new dat.GUI({closed: true, width: 400});
// gui.hide();
gui.width = 500
gui.addFolder("Box");



gui
.add(cube1.position, "x")
.min(-3).max(3)
.step(0.005)
.name("horizontal");

gui
.add(cube1.position,"y")
.min(-3)
.max(3)
.step(0.005)
.name("elevation");

gui
.add(cube1, "visible")
.name("visible")

gui
.add(cube1.material, "wireframe")
.name("启用线框模式")

gui
.addColor(parameters,"color")
.onChange(() => {
  cube1.material.color.set(parameters.color);
});

gui
.add(parameters,"spin");

//Animation
const tick = () => {
  rotateControl.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

//texture
const textLoader = new THREE.TextureLoader();
const colorTexture = await textLoader.loadAsync('/assets/textures/door/color.jpg');
colorTexture.repeat.x = 2;
colorTexture.repeat.y = 2;
colorTexture.center = new THREE.Vector2(0.5 ,0.5);
colorTexture.rotation = Math.PI/ 4;

colorTexture.wrapS = THREE.RepeatWrapping;
colorTexture.wrapT = THREE.RepeatWrapping;
const alphaTexture = await textLoader.loadAsync("/assets/textures/door/alpha.jpg")

const heightTexture = await textLoader.loadAsync("/assets/textures/door/height.jpg")

cube1.material = new THREE.MeshBasicMaterial({
  map: colorTexture,
  alphaMap: alphaTexture
})

tick();