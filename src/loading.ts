import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ACESFilmicToneMapping, AnimationMixer, CineonToneMapping, Clock, CubeTextureLoader, DirectionalLight, LinearToneMapping, LoadingManager, Mesh, MeshStandardMaterial, NoToneMapping, PCFSoftShadowMap, PerspectiveCamera, PlaneGeometry, ReinhardToneMapping, Scene, ShaderMaterial, sRGBEncoding, WebGLRenderer } from 'three';
import loadingVertex from './application/shaders/overLay/vertex.glsl?raw';
import loadingFragment from './application/shaders/overLay/fragment.glsl?raw';
import { GLTFLoader  } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from "dat.gui";
import gsap from 'gsap';

//Config
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}



//Loaders
const loadingBarElement = document.querySelector(".loading-bar") as Element;
const loadingManager = new LoadingManager(
    () => {
        setTimeout(() => {
            console.log(`loaded`);  
            gsap.to(overLayMaterial.uniforms.uAlpha, { duration: 3, value: 0 })
            loadingBarElement.classList.add(`ended`);   
            (loadingBarElement as any).style.transform = ``;
        }, 500)   
    },
    (_, itemLoaded, itemTotal) => {
        let progress = itemLoaded / itemTotal;
        (loadingBarElement as any).style.transform = `scaleX(${progress})`;
    },
    () => {
        console.log(`error`);        
    })

const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new CubeTextureLoader(loadingManager);

 
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
directionLight.position.set(-4.695, 0.399, -2.2);
directionLight.castShadow = true;
directionLight.shadow.mapSize.set(1024, 1024);
directionLight.shadow.camera.far = 15;
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
    envMapIntensity: 3.123
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
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
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
const renderer = new WebGLRenderer({canvas, antialias: true});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//Physicallly
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = sRGBEncoding;
renderer.toneMapping = ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.render(scene, camera);
gui.add(renderer,'toneMapping', {
    No: NoToneMapping,
    Linear: LinearToneMapping,
    Reinhard: ReinhardToneMapping,
    Cineon: CineonToneMapping,
    ACESFilmic: ACESFilmicToneMapping
}).onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10);

//OverLay
const overLayGeometry = new PlaneGeometry(2, 2, 1, 1);
const overLayMaterial = new ShaderMaterial({
    uniforms: {
        uAlpha: { value: 1.0 }
    },
    vertexShader: loadingVertex,
    fragmentShader: loadingFragment,
    // wireframe: true
    transparent: true
})
const overLayMesh = new Mesh(overLayGeometry, overLayMaterial);
scene.add(overLayMesh);

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