import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();
const box = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({
  color: "#ff0000"
})

const cube = new THREE.Mesh(box, material);
scene.add(cube);