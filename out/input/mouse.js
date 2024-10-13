import { canvas } from "../dom.js";
import { systems } from "../systems.js";
export function initMouse() {
    canvas.addEventListener('click', onMouseClick);
    canvas.addEventListener('mousewheel', onMouseWheel);
    canvas.addEventListener('mousemove', onMouseMove);
}
function xyForMouseEvent(evt) {
    return {
        x: evt.offsetX * devicePixelRatio,
        y: evt.offsetY * devicePixelRatio
    };
}
function onMouseClick(evt) {
    const e = evt;
    const center = systems.cam.mapInverse(xyForMouseEvent(e));
    console.log(center);
}
function onMouseWheel(evt) {
    const e = evt;
    const center = systems.cam.mapInverse(xyForMouseEvent(e));
    systems.cam.zoom(1 - e.deltaY / 1000, center);
    evt.preventDefault();
}
function onMouseMove(evt) {
    if (evt.buttons == 0)
        return;
    const delta = systems.cam.mapInverseDelta({ x: evt.movementX * devicePixelRatio, y: evt.movementY * devicePixelRatio });
    systems.cam.pan(delta);
    evt.preventDefault();
}
