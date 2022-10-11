import { CircleGeometry, Mesh, MeshStandardMaterial, RepeatWrapping, sRGBEncoding, AnimationMixer } from "three";
import { Engine } from "./engine";
import { Environment } from "./Environment";

export class World {
    public engine;
    public environment: any;
    public animationMixer: any;
    constructor() {
        this.engine = new Engine();
        this.engine.resources?.on('ready', () => {
            this.buildFloor();
            this.loadModel();
            this.environment = new Environment();
        })
    }

    buildFloor() {
        const colorTexture = this.engine.resources?.items.get('floorColor');
        colorTexture.encoding = sRGBEncoding;
        colorTexture.repeat.set(1.5, 1.5);
        colorTexture.wrapS = RepeatWrapping;
        colorTexture.wrapT = RepeatWrapping; 
        const normalTexture = this.engine.resources?.items.get('floorNormal');
        normalTexture.repeat.set(1.5, 1.5);
        normalTexture.wrapS = RepeatWrapping;
        normalTexture.wrapT = RepeatWrapping; 

        const floor = new Mesh(new CircleGeometry(10, 64, 64), new MeshStandardMaterial({
            map: colorTexture,
            normalMap: normalTexture
        }))
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.engine.scene?.add(floor);
    }

    loadModel() {
        const model = this.engine.resources?.items.get("foxModel");
        model.scene.scale.set(0.025, 0.025, 0.025);
        this.engine.scene?.add(model.scene);
        model.scene.traverse((child: any) => {
            if (child instanceof Mesh) {
                child.castShadow = true;
            }
        })
        console.log(model);
        
        this.animationMixer = new AnimationMixer(model.scene);
        const aniationAction = this.animationMixer.clipAction(model.animations[0]);
        aniationAction.play();
    }

    update(elapedTime: number) {
        if (this.animationMixer) {
            this.animationMixer.update(elapedTime * 0.001);
        }
    }

    build() {
     
    }
}