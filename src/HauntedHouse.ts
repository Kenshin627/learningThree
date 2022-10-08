import './style.css'
import { AmbientLight, BoxGeometry, BufferAttribute, ConeGeometry, DirectionalLight, DoubleSide, Float32BufferAttribute, Fog, Group, HemisphereLight, Mesh, MeshStandardMaterial, PerspectiveCamera, PlaneGeometry, PointLight, PointLightHelper, RectAreaLight, RepeatWrapping, Scene, SphereGeometry, SpotLight, SpotLightHelper, TextureLoader, TorusGeometry, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

//Config
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const canvas = document.querySelector("#container") as HTMLCanvasElement;

//Scene
const scene = new Scene();

//Fog
const fog = new Fog("#262837",1, 15);
scene.fog = fog;

//Camera
const camera = new PerspectiveCamera(75, size.width / size.height, 0.1 ,2000);
camera.position.set(0, 2, 2);
scene.add(camera);

//Control
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.update();

//light
const ambientLight = new AmbientLight('#b9d5ff', 0.12);
scene.add(ambientLight);
const moonLight = new DirectionalLight("b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
scene.add(moonLight);

//Door Light
const doorLight = new PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);

//Ghost
const ghost1 = new PointLight('#ff00ff', 2, 3);
scene.add(ghost1);

//Textures
//Door
const textureLoader = new TextureLoader();
const doorColorTexture = textureLoader.load('/assets/textures/door/color.jpg');
const alphaTexture = textureLoader.load('/assets/textures/door/alpha.jpg');
const ambientOcclusionTexture = textureLoader.load('/assets/textures/door/ambientOcclusion.jpg');
const heightTexture = textureLoader.load('/assets/textures/door/height.jpg');
const metalnessTexture = textureLoader.load('/assets/textures/door/metalness.jpg');
const normalTexture = textureLoader.load('/assets/textures/door/normal.jpg');
const roughnessTexture = textureLoader.load('/assets/textures/door/roughness.jpg');

//Wall
const brickColorTexture = textureLoader.load('/assets/textures/bricks/color.jpg');
const brickaoTexture = textureLoader.load('/assets/textures/bricks/ambientOcclusion.jpg');
const bricknormalTexture = textureLoader.load('/assets/textures/bricks/normal.jpg');
const brickroughnessTexture = textureLoader.load('/assets/textures/bricks/roughness.jpg');

//Grass
const grassColorTexture = textureLoader.load('/assets/textures/grass/color.jpg');
const grassAoTexture = textureLoader.load('/assets/textures/grass/ambientOcclusion.jpg');
const grassNormalTexture = textureLoader.load('/assets/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('/assets/textures/grass/roughness.jpg');

grassColorTexture.repeat.set(8, 8);
grassAoTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = RepeatWrapping;
grassAoTexture.wrapS =RepeatWrapping;
grassNormalTexture.wrapS = RepeatWrapping;
grassRoughnessTexture.wrapS = RepeatWrapping;

grassColorTexture.wrapT = RepeatWrapping;
grassAoTexture.wrapT =RepeatWrapping;
grassNormalTexture.wrapT = RepeatWrapping;
grassRoughnessTexture.wrapT = RepeatWrapping;

//Material
const planeMaterial = new MeshStandardMaterial({
    map: grassColorTexture,
    normalMap: grassNormalTexture,
    aoMap: grassAoTexture,
    roughnessMap: grassRoughnessTexture
})

const sphereMaterial = new MeshStandardMaterial();
sphereMaterial.roughness = 0.5;

//Objects
const planeGeometry = new PlaneGeometry(20, 20);
const plane = new Mesh(planeGeometry, planeMaterial);
planeGeometry.setAttribute("uv2", new Float32BufferAttribute(planeGeometry.attributes.uv.array, 2));
plane.rotation.x = -Math.PI / 2;

scene.add(plane);

const house = new Group();
scene.add(house);
house.add(doorLight);

//Walls
const box = new BoxGeometry(4, 2.5, 4);
const wallMaterial = new MeshStandardMaterial({ 
    map: brickColorTexture,
    aoMap: brickaoTexture,
    normalMap: bricknormalTexture,
    roughnessMap: brickroughnessTexture
});
const wall = new Mesh(box, wallMaterial);
wall.geometry.setAttribute("uv2",new Float32BufferAttribute(wall.geometry.attributes.uv.array, 2));
wall.position.y = 1.25;
house.add(wall);

//roof
const roof = new Mesh(
    new ConeGeometry(3.5, 1, 4),
    new MeshStandardMaterial({color: "#b35f45"})
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI / 4;
house.add(roof);

//door
const door = new Mesh(
    new PlaneGeometry(2, 2),
    new MeshStandardMaterial({
        transparent: true,
        map: doorColorTexture,
        alphaMap: alphaTexture,
        aoMap: ambientOcclusionTexture,
        displacementMap: heightTexture,
        displacementScale: 0.1,
        normalMap: normalTexture,
        metalnessMap: metalnessTexture,
        roughnessMap: roughnessTexture
    })
)
door.position.z += 2 + 0.001;
door.position.y += 1;
door.geometry.setAttribute("uv2", new Float32BufferAttribute(door.geometry.attributes.uv.array, 2));
house.add(door);

//bush
const bushGeometry = new SphereGeometry(1, 16, 16);
const bushMaterial = new MeshStandardMaterial({color: '#89c854'});

const bush1 = new Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6)
scene.add(bush1, bush2, bush3, bush4);

//Graves
const graves = new Group();
scene.add(graves);

const graveGeometry = new BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new MeshStandardMaterial({color: '#b2b6b1'});

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 6 + 3;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const grave = new Mesh(graveGeometry, graveMaterial);
    graves.add(grave);
    grave.position.set(x, plane.position.y + 0.01 + 0.4, z);
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
}


//Renderer
const renderer = new WebGLRenderer({canvas});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
renderer.setClearColor("#262837");

//resize
window.addEventListener("resize", () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    renderer.setSize(size.width, size.height);
})

//RenderLoop
const tick = () => {
    control.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}
tick();