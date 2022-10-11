import { Scene } from "three";
import { Timer } from "./utils/timer";
import { Viewport } from "./viewport";
import { Camera } from './camera';
import { Renderer } from "./renderer";
import { Resource } from "./utils/resources";
import { sources } from "./assets/sources";
import { World } from './world';

let instance: Engine;

export class Engine {
    public scene;
    public viewport;
    public camera;
    public renderer;
    public dom;
    private timer;
    public resources;
    public world;
    constructor() {
        if (instance) {
            return instance;
        }
        instance = this;
        //Scene
        this.scene = new Scene();
        
        //Viewport
        this.viewport = new Viewport(window.innerWidth, window.innerHeight, window.devicePixelRatio);
        this.viewport.on('resize', (width: number, height: number) => {
            this.resize(width, height);
        })
        this.dom = document.querySelector("#container") as HTMLCanvasElement;
        
        this.camera = new Camera();

        this.renderer = new Renderer();
        
        this.timer = new Timer();
        this.timer.on('tick', (delta: number, elapsed: number) => {
            this.renderLoop(delta);
        }) 

        this.resources = new Resource(sources);
        this.world = new World();
    }

    private renderLoop(delta: number) {        
        this.camera?.update();
        (this.world as World).update(delta);
        this.renderer?.update();
    }

    private resize(width: number, height: number) {
        this.camera?.resize(width / height);
        this.renderer?.resize(width, height);
    }
}