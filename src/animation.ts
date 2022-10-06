import { Object3D } from "three";

export const tick = (obj: Object3D) => {
    obj.rotation.y += Math.PI / 2 / 60;
    window.requestAnimationFrame(tick.bind(null, obj));
}