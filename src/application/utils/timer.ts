import { EventEmiter } from "./eventEmiter";

export class Timer extends EventEmiter {
    public start: number = 0;
    public lastTime: number = 0;
    public elaspedTime: number = 0;
    constructor(){
        super();
        this.start = Date.now();
        requestAnimationFrame(() => {
            this.tick();
        })
    }

    tick() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastTime;
        this.elaspedTime = currentTime - this.start;
        this.lastTime = currentTime;
        this.emit('tick', deltaTime);
        requestAnimationFrame(() => {
            this.tick();
        })
    }
}