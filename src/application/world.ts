import { BufferAttribute, CircleGeometry, Mesh, MeshStandardMaterial, RepeatWrapping, sRGBEncoding, AnimationMixer, PlaneGeometry, TextureLoader, RawShaderMaterial, DoubleSide, Vector2, Vector3, Color } from "three";
import { Engine } from "./engine";
import vertexShader from './shaders/base/vertex.glsl?raw';
import fragmentShader from './shaders/base/fragment.glsl?raw';
import patternVertex from './shaders/pattern/vertex.glsl?raw';
import patternFragment from './shaders/pattern/fragment.glsl?raw';
import seaVertex from './shaders/ragingSea/vertex.glsl?raw';
import seaFragment from './shaders/ragingSea/fragment.glsl?raw';
import * as dat from 'dat.gui';

export class World {
    public engine;
    public environment: any;
    public animationMixer: any;
    constructor() {
        this.engine = new Engine();
        /**
         * 1.
         */
        // this.engine.resources?.on('ready', () => {
        //     this.buildFloor();
        //     this.loadModel();
        //     this.environment = new Environment();
        // })
        /**
         * 2.
         */
        // this.build();
        /**
         * 3.
         */
        // this.pattern();

        /**
         * Raging Sea
         */
        this.ragingSea();
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

    pattern() {
        const planGeometry = new PlaneGeometry(1, 1, 32, 32);
        const material = new RawShaderMaterial({
            vertexShader:patternVertex,
            fragmentShader: patternFragment
        })
        const mesh = new Mesh(planGeometry, material);
        this.engine.scene?.add(mesh);
    }

    ragingSea() {
        //debugObject
        const debugObject = {
            depthColor: '#186691',
            surfaceColor: '#9bd8ff'
        }
        const seaGeometry = new PlaneGeometry(2, 2, 512, 512);
        const material = new RawShaderMaterial({
            vertexShader: seaVertex,
            fragmentShader: seaFragment,
            uniforms: {
                u_bigWaveElevation: { value: 0.2 },
                u_bigWaveFrequency: { value: new Vector2(4, 1.5) },
                u_BigWaveSpeed: { value: 0.575},

                u_time: { value: 0 },

                depthColor: { value: new Color(debugObject.depthColor) },
                surfaceColor: { value: new Color(debugObject.surfaceColor) },
                u_coloroffset: { value: 0.08 },
                u_colorMultiplier: { value: 5 },

                u_smallWavesElevation: { value: 0.15 },
                u_smallWavesFrequency: { value: 3. },
                u_smallWavesSpeed: { value: 0.2 },
                u_smallWavesiterations: { value: 4.0 }                
            }
        })

        const sea = new Mesh(seaGeometry, material);
        sea.rotation.x = -Math.PI / 2.0;
        this.engine.timer?.on("tick", (_: number, time: number) => {
            material.uniforms.u_time.value = time / 1000 ;
        })
        this.engine.scene?.add(sea);

        //gui 
        const gui = new dat.GUI();
        gui.add(material.uniforms.u_bigWaveElevation, "value").min(0).max(1).step(0.001).name("bigWaveElevation");
        gui.add(material.uniforms.u_bigWaveFrequency.value, "x").min(0).max(10).step(0.01).name("frequencyX");
        gui.add(material.uniforms.u_bigWaveFrequency.value, "y").min(0).max(10).step(0.01).name("frequencyY");
        gui.add(material.uniforms.u_BigWaveSpeed, "value").min(0).max(4).step(0.001).name("waveSpeed");
        gui.addColor(debugObject, "depthColor").name("depthColor").onChange(() => {
            material.uniforms.depthColor.value.set(debugObject.depthColor);
        });
        gui.addColor(debugObject, "surfaceColor").name("surfaceColor").onChange(() => {
            material.uniforms.surfaceColor.value.set(debugObject.surfaceColor);
        });
        gui.add(material.uniforms.u_coloroffset, "value").min(0).max(1).step(0.001).name("colorOffset");
        gui.add(material.uniforms.u_colorMultiplier, "value").min(0).max(5).step(0.001).name("colorMultiplier");
        gui.add(material.uniforms.u_smallWavesElevation, "value").min(0).max(1).step(0.001).name("smallWavesElevation");
        gui.add(material.uniforms.u_smallWavesFrequency, "value").min(1).max(10).step(0.01).name("smallWavesFrequency");
        gui.add(material.uniforms.u_smallWavesSpeed, "value").min(0).max(1).step(0.001).name("smallWavesSpeed");
        gui.add(material.uniforms.u_smallWavesiterations, "value").min(1).max(20).step(1).name("smallWavesiterations");
    }
}