import './style.css'
import { AdditiveBlending, AmbientLight, BufferAttribute, BufferGeometry, Clock, Color, DirectionalLight, PerspectiveCamera, Points, RawShaderMaterial, Scene, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import galaxyVertex from './application/shaders/galaxy/vertex.glsl?raw';
import galaxyFragment from './application/shaders/galaxy/fragment.glsl?raw';


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

//Controls
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.update();

//Lights
const ambientLight = new AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionLight = new DirectionalLight(0XFFFFFF, 1.0);
scene.add(directionLight);

//Galaxy_Generator
type galaxyParameter = {
    count: number;
    size: number;
    branch: number;
    radius: number;
    spin: number;
    randomness: number;
    randomPower: number;
    innerColor: string;
    outterColor: string;
    speed: number;
}
let particleGeometry: BufferGeometry;
let particleMaterial: RawShaderMaterial;
const Galaxy_Generator = () => {
    //Varibles

    let points: Points; 
    return (options: galaxyParameter) => {
        //dispsoe
        if (particleGeometry) {
            particleGeometry.dispose();
        }
        if (particleMaterial) {
            particleMaterial.dispose();
        }
        if (points) {
            scene.remove(points);
        }
 
        /**
         * Geometry
         */
        const { branch, radius: r, randomness, randomPower, innerColor, outterColor, count } = options;
        const centerColor = new Color(innerColor);
        const outColor = new Color(outterColor);
        particleGeometry = new BufferGeometry();
        const positionArray = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const aScale = new Float32Array(count * 1);
        const aRandomness = new Float32Array(count * 3);
        const circle = Math.PI * 2;
        const branchAngle = circle / branch;
        for (let i = 0; i < count; i++) {

            //Position
            const i3 = i * 3;
            const radius = Math.random() * r;  
            const branchNo = i % branch;
            const cBranchAngle = branchNo * branchAngle;  

            positionArray[i3 + 0] = Math.cos(cBranchAngle) * radius;
            positionArray[i3 + 2] = Math.sin(cBranchAngle) * radius;
            positionArray[i3 + 1] = 0;

            //Scale
            aScale[i] = Math.random();

            //Color
            let mixColor = centerColor.clone();
            mixColor.lerp(outColor, radius / r);
            colors[i3 + 0] = mixColor.r;
            colors[i3 + 1] = mixColor.g;
            colors[i3 + 2] = mixColor.b;

            //Randomness
            const randomX = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5? 1: -1) * randomness * radius;
            const randomY = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5? 1: -1) * randomness * radius;
            const randomZ = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5? 1: -1) * randomness * radius;
            aRandomness[i3 + 0] = randomX;
            aRandomness[i3 + 1] = randomY;
            aRandomness[i3 + 2] = randomZ;
        }
        
        particleGeometry.setAttribute("position", new BufferAttribute(positionArray, 3));
        particleGeometry.setAttribute("color", new BufferAttribute(colors, 3));
        particleGeometry.setAttribute("aScale", new BufferAttribute(aScale, 1));
        particleGeometry.setAttribute("aRandomness", new BufferAttribute(aRandomness, 3));


        /**
         * Material
         */
        particleMaterial = new RawShaderMaterial({
            vertexShader: galaxyVertex,
            fragmentShader: galaxyFragment,
            depthWrite: false,
            blending: AdditiveBlending,
            vertexColors: true,
            uniforms: {
                uSize: { value: 20 * renderer.getPixelRatio() },
                uTime: { value: 0 },
                speed: { value: params.speed }
            }
        })

        /**
         * Points
         */
        points = new Points(particleGeometry, particleMaterial);
        scene.add(points);
    }
};

let params: galaxyParameter = {
    count: 200000,
    size: 0.005,
    branch: 3,
    radius: 5,
    spin: 1,
    randomness: 0.2,
    randomPower: 3,
    speed: 0.35,
    innerColor: '#ff6030',
    outterColor: '#1b3984'
};
const genarator = Galaxy_Generator();

//GUI
const gui = new dat.GUI();
gui.add(params, 'count').min(100).max(1000000).step(100).onFinishChange(genarator.bind(this, params));
gui.add(params, 'branch').min(2).max(20).step(1).onFinishChange(genarator.bind(this, params));
gui.add(params, 'radius').min(2).max(10).step(1).onFinishChange(genarator.bind(this, params));

gui.add(params, 'randomness').min(0).max(2).step(0.001).onFinishChange(genarator.bind(this, params));
gui.add(params, 'randomPower').min(1).max(10).step(0.1).onFinishChange(genarator.bind(this, params));
gui.add(params, 'speed').min(0.1).max(1).step(0.001).onFinishChange(genarator.bind(this, params));
gui.addColor(params,'innerColor').onFinishChange(genarator.bind(this, params));
gui.addColor(params, 'outterColor').onFinishChange(genarator.bind(this, params));


//Renderer
const renderer = new WebGLRenderer({canvas});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

genarator(params);

//Resize
window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    renderer.setSize(size.width, size.height);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
})

//RenderLoop

const clock = new Clock();

const tick = () => {
    control.update();
    let elapsedTime = clock.getElapsedTime();
    particleMaterial.uniforms.uTime.value = elapsedTime;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();
