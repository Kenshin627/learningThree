import { EventEmiter } from "./utils/eventEmiter";

export class Viewport extends EventEmiter {
    public width: number;
    public height: number;
    public pixelRatio: number;
    constructor(width: number, height: number, pixelRatio: number) {
        super();
        this.width = width;
        this.height = height;
        this.pixelRatio = Math.min(pixelRatio, 2);
        this.resize();
    }

    private resize() {
        window.addEventListener('resize',  _=> {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.emit('resize', this.width, this.height);
        })
    }
}