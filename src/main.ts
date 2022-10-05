import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();
const box = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({
  color: "#ff0000"
})

const cube = new THREE.Mesh(box, material);
scene.add(cube);

//camera
const cameraConfig = {
  fov: 75,
  width: 800,
  height: 600,
  near: 0.1,
  far: 2000
}
const camera = new THREE.PerspectiveCamera(cameraConfig.fov, cameraConfig.width / cameraConfig.height, cameraConfig.near, cameraConfig.far);
camera.position.z = 2;
scene.add(camera);

//Renderer
const canvas = document.querySelector("#container") as HTMLCanvasElement;

const rendererOpts: THREE.WebGLRendererParameters = {
  canvas
};
const renderer = new THREE.WebGLRenderer(rendererOpts)

renderer.setSize(cameraConfig.width, cameraConfig.height);

renderer.render(scene, camera);