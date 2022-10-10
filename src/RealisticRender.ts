import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AmbientLight, AnimationMixer, Clock, CubeTextureLoader, DirectionalLight, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer } from 'three';
import { GLTFLoader  } from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from "dat.gui";

//Config
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}



//Loaders
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new CubeTextureLoader();


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
const directionLight = new DirectionalLight(0xffffff, 1.0);
directionLight.position.set(0.25, 3, -2.25);
scene.add(directionLight);

//Environmnet map
const environmnetMap = cubeTextureLoader.load([
    '/assets/textures/environmentMaps/0/px.jpg',
    '/assets/textures/environmentMaps/0/nx.jpg',
    '/assets/textures/environmentMaps/0/py.jpg',
    '/assets/textures/environmentMaps/0/ny.jpg',
    '/assets/textures/environmentMaps/0/pz.jpg',
    '/assets/textures/environmentMaps/0/nz.jpg',
])

scene.background = environmnetMap;

//GUI
const gui = new dat.GUI();
const debugObject = {
    envMapIntensity: 5
}

gui.add(directionLight, 'intensity').min(0).max(10).step(0.001).name("lightIntensity");
gui.add(directionLight.position, 'x').min(-5).max(5).step(0.001).name("lightX");
gui.add(directionLight.position, 'y').min(-5).max(5).step(0.001).name("lightY");
gui.add(directionLight.position, 'z').min(-5).max(5).step(0.001).name("lightZ");

const updateAllMaterials = () => {
    scene.traverse(child => {
        if (child instanceof Mesh && child.material && child.material instanceof MeshStandardMaterial) {
            child.material.envMap = environmnetMap;
            child.material.envMapIntensity = debugObject.envMapIntensity;
        }
    })
}

//Loaders
let animationMixer: AnimationMixer;
gltfLoader.load('/assets/models/FlightHelmet/glTF/FlightHelmet.gltf',(data) => {
    // animationMixer = new AnimationMixer(data.scene);
    // const aniationAction = animationMixer.clipAction(data.animations[2]);
    // aniationAction.play();
    // data.scene.scale.set(0.025, 0.025 ,0.025);
    gui.add(data.scene.rotation, 'y').min(-Math.PI).max(Math.PI).name("sceneRotation")
    data.scene.scale.set(10, 10, 10);
    updateAllMaterials();
    gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).name("envMapInteisty").onChange(updateAllMaterials);
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
//Physicallly
renderer.physicallyCorrectLights = true;
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