import { BufferAttribute, CircleGeometry, Mesh, MeshStandardMaterial, RepeatWrapping, sRGBEncoding, AnimationMixer, PlaneGeometry, TextureLoader, RawShaderMaterial, DoubleSide, Vector2 } from "three";
import { Engine } from "./engine";
import { Environment } from "./Environment";
import vertexShader from './shaders/base/vertex.glsl?raw';
import fragmentShader from './shaders/base/fragment.glsl?raw';
import * as dat from 'dat.gui';

export class World {
    public engine;
    public environment: any;
    public animationMixer: any;
    constructor() {
        this.engine = new Engine();
        // this.engine.resources?.on('ready', () => {
        //     this.buildFloor();
        //     this.loadModel();
        //     this.environment = new Environment();
        // })
        this.build()
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
        const planeGeometry = new PlaneGeometry(1, 1, 32, 32);
        const count = planeGeometry.attributes.position.count;        
        const colorAttributes = new Float32Array(count * 3);
        const edges = [count / 3, count * 2 / 3];
        for (let i = 0; i < count; i++) {
            let index = i * 3;
            if (i < edges[0]) {
                colorAttributes[index] = 1.0;
                colorAttributes[index + 1] = 0.0;
                colorAttributes[index + 2] = 0.0;
            }else if(i >= edges[0] && i < edges[1]) {
                colorAttributes[index] = 1.0;
                colorAttributes[index + 1] = 1.0;
                colorAttributes[index + 2] = 1.0;
            }else {
                colorAttributes[index] = 0.0;
                colorAttributes[index + 1] = 0.0;
                colorAttributes[index + 2] = 1.0;
            }
        }
        planeGeometry.setAttribute('aColor', new BufferAttribute(colorAttributes, 3));
        const textureLoader = new TextureLoader();
        const flagTexture = textureLoader.load('/assets/textures/flag.jpg');
        console.log(flagTexture);
        
        const material = new RawShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            side: DoubleSide,
            // wireframe: true,
            uniforms: {
                uFrequency: { value: new Vector2(10.0, 10.0) },
                u_time: { value: 0 },
                u_texture: { value: flagTexture }
            }
        })

        const mesh = new Mesh(planeGeometry, material);
        mesh.scale.y = 2 / 3;
        this.engine.scene?.add(mesh);
        this.engine.timer?.on('tick', (_: number, time: number) => {
            material.uniforms.u_time.value = time / 500;
        })
        
        const gui = new dat.GUI();
        gui.add(material.uniforms.uFrequency.value, 'x').min(1).max(20).step(1).name("x-frequency");
        gui.add(material.uniforms.uFrequency.value, 'y').min(1).max(20).step(1).name('y-frequency');
    }
}