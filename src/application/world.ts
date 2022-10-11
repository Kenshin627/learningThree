import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import { Engine } from "./engine";

export class World {
    public engine;
    constructor() {
        this.engine = new Engine();
    }

    build() {
        const object = new Mesh(new BoxGeometry(1,1,1), new MeshBasicMaterial({
            wireframe: true
        }));

        this.engine.scene?.add(object);
    }
}