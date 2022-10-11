import { ACESFilmicToneMapping, Camera, PCFSoftShadowMap, Scene, sRGBEncoding, WebGLRenderer } from "three"
import { Engine } from "./engine";
import { Viewport } from "./viewport";

export class Renderer {
    public instance;
    public engine: Engine;
    constructor() {
        this.engine = new Engine();
        this.instance = new WebGLRenderer({
            canvas: this.engine.dom,
            antialias: true
        })
        const viewport = this.engine.viewport as Viewport;
        this.instance.setSize(viewport.width, viewport.height);
        this.instance.setPixelRatio(viewport.pixelRatio);
        this.instance.setClearColor("#303030");
        //Physically
        this.instance.physicallyCorrectLights = true;
        this.instance.outputEncoding = sRGBEncoding;
        this.instance.toneMapping = ACESFilmicToneMapping;
        this.instance.toneMappingExposure = 1.1;
        this.instance.shadowMap.enabled = true;
        this.instance.shadowMap.type = PCFSoftShadowMap;
        this.update();
    }

    update() {
        this.instance.render(this.engine.scene as Scene, this.engine.camera?.instance as Camera);
    }

    resize(width: number, height: number) {
        this.instance.setSize(width, height);
    }
}