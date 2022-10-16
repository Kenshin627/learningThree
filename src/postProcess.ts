import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ACESFilmicToneMapping, AnimationMixer, CineonToneMapping, Clock, CubeTextureLoader, DirectionalLight, LinearFilter, LinearToneMapping, Mesh, MeshStandardMaterial, NoToneMapping, PCFSoftShadowMap, PerspectiveCamera, ReinhardToneMapping, RGBAFormat, Scene, sRGBEncoding, TextureLoader, WebGLRenderer, WebGLRenderTarget } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';

import rgbShiftVertex from './application/shaders/rgbShift/vertex.glsl?raw';
import rgbShiftFragment from './application/shaders/rgbShift/fragment.glsl?raw';

import displacementVertex from './application/shaders/displacement/vertex.glsl?raw';
import displacementFragment from './application/shaders/displacement/fragment.glsl?raw';

import normalMapVertex from './application/shaders/normalMapPass/vertex.glsl?raw';
import normalMapFragment from './application/shaders/normalMapPass/fragment.glsl?raw';

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
    envMapIntensity: 4.5
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

    //update effect composer
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    composer.setSize(size.width, size.height);
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

//PostProcess
const renderTarget = new WebGLRenderTarget(size.width, size.height, {
    minFilter: LinearFilter,
    magFilter: LinearFilter,
    format: RGBAFormat,
    encoding: sRGBEncoding
})
const composer = new EffectComposer(renderer, renderTarget);
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
composer.setSize(size.width, size.height);  
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const dotScreenPass = new DotScreenPass();
dotScreenPass.enabled = false;
composer.addPass(dotScreenPass);

const glitchPass = new GlitchPass();
glitchPass.enabled = false;
glitchPass.goWild = false;
composer.addPass(glitchPass);

//RGBShift
const rgbShiftPass = new ShaderPass(RGBShiftShader);
RGBShiftShader.uniforms.amount.value = 10;
rgbShiftPass.enabled = false;
composer.addPass(rgbShiftPass);

//CustomPass
const shader = {
    uniforms: {
        tDiffuse: ""
    },
    vertexShader: rgbShiftVertex,
    fragmentShader: rgbShiftFragment
}
const customPass = new ShaderPass(shader);
customPass.enabled = false;
composer.addPass(customPass);

//DisplaceMent
const displaceShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 }
    },
    vertexShader: displacementVertex,
    fragmentShader: displacementFragment
}

const displacementPass = new ShaderPass(displaceShader);
displacementPass.enabled = false;
composer.addPass(displacementPass);

//InterfaceNormalMap
const normalMapShader = {
    uniforms: {
        tDiffuse: { value: null },
        normalMap: { value: null }
    },
    vertexShader: normalMapVertex,
    fragmentShader: normalMapFragment
}

const normalMapPass = new ShaderPass(normalMapShader);
const textureLoader = new TextureLoader();
normalMapPass.material.uniforms.normalMap.value = textureLoader.load("/assets/textures/interfaceNormalMap.png");
normalMapPass.enabled = true;
composer.addPass(normalMapPass);

//RenderLoop
const clock = new Clock();
const tick = () => {
    let deltaTime = clock.getDelta();
    let elapsedTime = clock.getElapsedTime();
    if (animationMixer) {
        animationMixer.update(deltaTime)
    }
    control.update();
    // renderer.render(scene, camera);
    // displaceShader.uniforms.uTime.value = elaspedTime;
    displacementPass.material.uniforms.uTime.value = elapsedTime;
    composer.render();
    requestAnimationFrame(tick);
}
tick();