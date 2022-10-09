import './style.css'
import { AdditiveBlending, AmbientLight, BufferAttribute, BufferGeometry, Color, DirectionalLight, PerspectiveCamera, Points,  PointsMaterial, Scene, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';


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
    count: number,
    size: number,
    branch: number,
    radius: number,
    spin: number,
    randomness: number,
    randomPower: number,
    innerColor: string,
    outterColor: string
}

const Galaxy_Generator = () => {
    //Varibles
    let particleGeometry: BufferGeometry;
    let particleMaterial: PointsMaterial;
    let points: Points;
    const attrCount = 3;
    
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
        const { branch, radius: r, spin, randomness, randomPower, innerColor, outterColor } = options;
        const centerColor = new Color(innerColor);
        const outColor = new Color(outterColor);
        particleGeometry = new BufferGeometry();
        const positionArray = new Float32Array(options.count * 3);
        const colors = new Float32Array(options.count * 3);
        const circle = Math.PI * 2;
        const branchAngle = circle / options.branch;
        for (let i = 0; i < options.count; i++) {

            //Position
            const i3 = i * attrCount;
            const radius = Math.random() * r;  
            const branchNo = i % branch;
            const spinAngle = spin * radius;
            const multply = branchNo * branchAngle;  

            const randomX = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5? 1: -1) * randomness;
            const randomY = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5? 1: -1) * randomness;
            const randomZ = Math.pow(Math.random(), randomPower) * (Math.random() < 0.5? 1: -1) * randomness;

            positionArray[i3 + 0] = Math.cos(multply + spinAngle) * radius + randomX;
            positionArray[i3 + 2] = Math.sin(multply + spinAngle) * radius + randomZ;
            positionArray[i3 + 1] = randomY;

            //Color
            let mixColor = centerColor.clone();
            mixColor.lerp(outColor, radius / r);
            colors[i3 + 0] = mixColor.r;
            colors[i3 + 1] = mixColor.g;
            colors[i3 + 2] = mixColor.b;
        }
        particleGeometry.setAttribute("position", new BufferAttribute(positionArray, attrCount));
        particleGeometry.setAttribute("color", new BufferAttribute(colors, 3));

        /**
         * Material
         */
        particleMaterial = new PointsMaterial({
            size: options.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: AdditiveBlending,
            vertexColors: true
        })

        /**
         * Points
         */
        points = new Points(particleGeometry, particleMaterial);
        scene.add(points);
    }
};

let params: galaxyParameter = {
    count: 627700,
    size: 0.001,
    branch: 3,
    radius: 10,
    spin: 1.27,
    randomness: 0.6538,
    randomPower: 1.8,
    innerColor: '#ff9130',
    outterColor: '#682d9d'
};
const genarator = Galaxy_Generator();
genarator(params);
//GUI
const gui = new dat.GUI();
gui.add(params, 'count').min(100).max(1000000).step(100).onFinishChange(genarator.bind(this, params));
gui.add(params, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(genarator.bind(this, params));
gui.add(params, 'branch').min(2).max(20).step(1).onFinishChange(genarator.bind(this, params));
gui.add(params, 'radius').min(2).max(10).step(1).onFinishChange(genarator.bind(this, params));
gui.add(params, 'spin').min(1).max(2).step(0.01).onFinishChange(genarator.bind(this, params));
gui.add(params, 'randomness').min(0).max(2).step(0.001).onFinishChange(genarator.bind(this, params));
gui.add(params, 'randomPower').min(1).max(10).step(0.1).onFinishChange(genarator.bind(this, params));
gui.addColor(params,'innerColor').onFinishChange(genarator.bind(this, params));
gui.addColor(params, 'outterColor').onFinishChange(genarator.bind(this, params));


//Renderer
const renderer = new WebGLRenderer({canvas});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

//Resize
window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    renderer.setSize(size.width, size.height);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
})

//RenderLoop

const tick = () => {
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();
