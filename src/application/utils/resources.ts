import { CubeTextureLoader, Loader, TextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EventEmiter } from "./eventEmiter";

export type resourceType = 'texture' | 'gltf' | 'cubeTexture';
type loaderType = GLTFLoader | CubeTextureLoader | TextureLoader;
export type resource = {
    name: string;
    type: resourceType;
    path: string[] | string;
}
export class Resource extends EventEmiter {
    public loaders: Map<resourceType, any> = new Map();
    public resources: resource[] = [];
    public items: Map<string, any> = new Map();
    public resourceCount: number;
    public loaded: number;
    constructor(resources: resource[]){
        super();
        this.resources = resources;
        this.resourceCount = this.resources.length;
        this.loaded = 0;
        this.initLoaders();
        this.startLoading();
    }

    private initLoaders() {
        this.loaders.set('cubeTexture', new CubeTextureLoader());
        this.loaders.set("texture", new TextureLoader());
        this.loaders.set("gltf", new GLTFLoader());
    }

    private startLoading() {
        for (const source of this.resources) {
            this.loaders.get(source.type)?.load(source.path, (file: any) => {
                this.hasLoaded(source.name, file);
            })
        }
    }

    private hasLoaded(name: string, file: any) {
        this.loaded++;
        this.items.set(name, file);
        if (this.loaded === this.resourceCount) {
            this.emit("ready");
        }
    }
}