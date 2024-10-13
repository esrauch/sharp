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
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const cam = systems.cam;
        ctx.setTransform(cam.getTransform());
        const background = new Path2D();
        background.rect(0, 0, 1080, 1080);
        ctx.fillStyle = '#fff';
        ctx.fill(background);
        ctx.clip(background);
        ctx.fillStyle = '#f88';
        ctx.fillRect(-10, -10, 20, 20);
    }
}
