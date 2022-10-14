import { DirectionalLight, OrthographicCamera, sRGBEncoding, Scene, Mesh, MeshStandardMaterial } from "three";
import { Engine } from "./engine";

export class Environment {
    public engine;
    public scene;
    public sunLight: any;
    public environmentMap: any;
    constructor() {
        this.engine = new Engine();
        this.scene = this.engine.scene;
        this.setSunLight();
        this.setEnvironmentMap();
    }

    setSunLight() {
        this.sunLight = new DirectionalLight("#ffffff", 1);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024)
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3, 3, -2.25);
        this.scene?.add(this.sunLight);
    }

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 1.0;
        this.environmentMap.texture = this.engine.resources?.items.get('environmentMap');
        this.environmentMap.texture.encoding = sRGBEncoding;
        (this.engine.scene as Scene).environment = this.environmentMap.texture;
        this.environmentMap.updateMaterial = () => {
            this.engine.scene?.traverse((child) => {
                if (child instanceof Mesh && child.material && child.material instanceof MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity = this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            })
        }

        this.environmentMap.updateMaterial();
    }
}