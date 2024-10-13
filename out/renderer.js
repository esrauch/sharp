import { canvas } from "./dom.js";
import { systems } from "./systems.js";
export class Renderer {
    constructor() {
        this.raf = null;
    }
    render() {
        if (this.raf == null) {
            this.raf = requestAnimationFrame(() => {
                this.raf = null;
                this.renderActual();
            });
        }
    }
    renderImmediate() {
        if (this.raf != null) {
            cancelAnimationFrame(this.raf);
            this.raf = null;
        }
        this.renderActual();
    }
    renderActual() {
        canvas.width = canvas.width;
        const ctx = canvas.getContext('2d', { 'alpha': false });
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const cam = systems.cam;
        ctx.setTransform(cam.getTransform());
        ctx.strokeStyle = '#f55';
        ctx.lineWidth = 3;
        systems.model.render(ctx);
    }
}
