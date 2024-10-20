import { canvas } from "../dom.js";
import { systems } from "../systems.js";
import { Tool } from "./tool.js";
function xyForMouseEvent(evt) {
    return {
        x: evt.offsetX * devicePixelRatio,
        y: evt.offsetY * devicePixelRatio
    };
}
export class PolyTool extends Tool {
    constructor() {
        super(...arguments);
        this.name = 'Poly';
        this.el = null;
    }
    enableInternal(signal) {
        canvas.addEventListener('pointerdown', (evt) => this.pointerDown(evt), { signal });
        document.addEventListener('keydown', (evt) => {
            if (evt.key == ' ')
                this.finishElement();
        }, { signal });
    }
    disableInternal() {
        this.finishElement();
    }
    finishElement() {
        this.el = null;
        systems.model.doc().selectedElement = undefined;
    }
    pointerDown(evt) {
        if (!this.el) {
            this.el = systems.model.addNewPoly();
            systems.model.doc().selectedElement = this.el.id;
        }
        const xy = systems.cam.mapInverse(xyForMouseEvent(evt));
        this.el.pts.push(xy);
        systems.model.doc(); // Touch doc for render side effect
    }
}
