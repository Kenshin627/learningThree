import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AmbientLight, AnimationMixer, Clock, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer } from 'three';
import { GLTFLoader  } from 'three/examples/jsm/loaders/GLTFLoader'

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

//Control
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.update();

//Lights
const ambientLight = new AmbientLight(0xffffff, 0.7);
const directionLight = new DirectionalLight(0xffffff, 0.8);
scene.add(ambientLight, directionLight);


//Objects
const material = new MeshStandardMaterial({
    color: '#ffffff'
})
const plane = new Mesh(new PlaneGeometry(8, 8, 8), material);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

//Loaders
let animationMixer: AnimationMixer;
const gltfLoader = new GLTFLoader();
gltfLoader.load('/assets/models/Fox/glTF/Fox.gltf',(data) => {
    animationMixer = new AnimationMixer(data.scene);
    const aniationAction = animationMixer.clipAction(data.animations[2]);
    aniationAction.play();
    data.scene.scale.set(0.025, 0.025 ,0.025);
    scene.add(data.scene)

}, () => {}, () => {})

//Resize
window.addEventListener('resize', _=> {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    renderer.setSize(size.width, size.height);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
})

//Renderer
const renderer = new WebGLRenderer({canvas});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

//RenderLoop
const clock = new Clock();
const tick = () => {
    let elaspedTime = clock.getDelta();
    if (animationMixer) {
        animationMixer.update(elaspedTime)
    }
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}
tick();