import { canvas } from "../dom.js";
import { Poly, XY } from "../model.js";
import { systems } from "../systems.js";
import { Tool } from "./tool.js";

function xyForMouseEvent(evt: MouseEvent): XY {
    return {
        x: evt.offsetX * devicePixelRatio,
        y: evt.offsetY * devicePixelRatio
    }
}

export class PolyTool extends Tool {
    readonly name = 'Poly'

    private el: Poly | null = null

    protected override enableInternal(signal: AbortSignal): void {
        canvas.addEventListener('pointerdown', (evt) => this.pointerDown(evt), { signal })
        document.addEventListener('keydown', (evt) => {
            if (evt.key == ' ') this.finishElement()
        }, { signal })
    }

    protected override disableInternal(): void {
        this.finishElement()
    }

    private finishElement() {
        this.el = null
        systems.model.doc().selectedElement = undefined
    }

    private pointerDown(evt: PointerEvent) {
        if (!this.el) {
            this.el = systems.model.addNewPoly()
            systems.model.doc().selectedElement = this.el.id
        }
        const xy = systems.cam.mapInverse(xyForMouseEvent(evt))
        this.el.pts.push(xy)
        systems.model.doc()  // Touch doc for render side effect

    }
}