import './style.css'
import { AmbientLight, DirectionalLight, Mesh, MeshStandardMaterial, Object3D, PerspectiveCamera, Raycaster, Scene, SphereGeometry, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



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
camera.position.set(0, 0, 10);
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

//Objects
const sphereGeometry = new SphereGeometry(0.5, 32, 32);
const sphereMaterial = new MeshStandardMaterial({color: '#ff0000'});

const sphere1 = new Mesh(sphereGeometry, sphereMaterial);
sphere1.position.x = -2;
sphere1.name = `sphere1`;
const sphere2 = new Mesh(sphereGeometry, sphereMaterial.clone());
sphere2.name = `sphere2`;
const sphere3 = new Mesh(sphereGeometry, sphereMaterial.clone());
sphere3.position.x = 2;
sphere3.name = `sphere3`;
scene.add(sphere1, sphere2, sphere3);
//Renderer
const renderer = new WebGLRenderer({canvas});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

//RayCaster
const rayCaster = new Raycaster();
const mouse = {
    x: 0,
    y: 0
}
const intersectObjects = [sphere1, sphere2, sphere3];

window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / size.width) * 2 - 1;
    mouse.y = -(event.clientY / size.height) * 2 + 1;
})
// window.addEventListener('click', (event) => {
//     mouse.x = (event.clientX / size.width) * 2 - 1;
//     mouse.y = -(event.clientY / size.height) * 2 + 1;
// })

//Resize
window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    renderer.setSize(size.width, size.height);
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
})

//RenderLoop
let intersetedObjects: Object3D[] = [];
let currentObj: any;
const tick = () => {
    intersetedObjects = [];
    rayCaster.setFromCamera(mouse, camera);
    intersetedObjects = rayCaster.intersectObjects(intersectObjects).map(i => i.object);
    intersectObjects.forEach(obj => {
        if (intersetedObjects.includes(obj)) {
            obj.material.color.set(0x00ff98)
        }else {
            obj.material.color.set(0xff0000)
        }
    })
    if (intersetedObjects.length) {
        if (!currentObj) {
            currentObj = intersetedObjects[0];
            console.log(`enter ${currentObj.name}`);            
        }
    }else {
        if (currentObj) {
            console.log(`leave ${currentObj.name}`);
            currentObj = undefined;
        }
    }
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

tick();
