import { PerspectiveCamera } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Engine } from "./engine";
import { Viewport } from "./viewport";

export class Camera {
    public instance: PerspectiveCamera;
    public engine: Engine;
    public aspect: number;
    public control;
    constructor() {
        this.engine = new Engine();
        const viewport = this.engine.viewport as Viewport;
        this.aspect = viewport.width / viewport.height;
        this.instance = new PerspectiveCamera(75, this.aspect, 0.1, 1000);
        this.instance.position.set(1, 2, 2);
        this.engine.scene?.add(this.instance);
        this.control = new OrbitControls(this.instance, this.engine.dom);
        this.control.enableDamping = true;
        this.control.update();
    }

    resize(aspect: number) {
        this.aspect = aspect;
        this.instance.aspect = aspect;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.control.update();
    }
}