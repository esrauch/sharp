import { systems } from "./systems.js";
const pathCache = new WeakMap();
function cachedPath(el) {
    const cached = pathCache.get(el);
    if (cached)
        return cached;
    const p = new Path2D();
    switch (el.type) {
        case 'Rect':
            p.rect(el.x, el.y, el.w, el.h);
            break;
        case 'Poly':
            for (const pt of el.pts)
                p.lineTo(pt.x, pt.y);
            break;
    }
    return p;
}
export class Model {
    constructor() {
        this.doc_ = {
            root: {
                type: 'Group',
                id: 0,
                elements: []
            },
            bg: '#ddddbb',
            fg: '#ff8888',
            nextId: 0,
        };
    }
    doc() {
        systems.renderer.render();
        return this.doc_;
    }
    render(ctx) {
        const bounds = new Path2D();
        bounds.rect(0, 0, 1080, 1080);
        ctx.fillStyle = this.doc_.bg;
        ctx.fill(bounds);
        ctx.strokeStyle = '#fff';
        ctx.stroke(bounds);
        ctx.clip(bounds);
        ctx.fillStyle = this.doc_.fg;
        this.renderElement(ctx, this.doc_.root);
    }
    renderElement(ctx, el) {
        const mustSave = el.transform || el.fillStyle;
        if (mustSave)
            ctx.save();
        if (el.transform) {
            ctx.setTransform(ctx.getTransform().multiply(el.transform));
        }
        if (el.fillStyle)
            ctx.fillStyle = el.fillStyle;
        switch (el.type) {
            case 'Group':
                for (const child of el.elements)
                    this.renderElement(ctx, child);
                break;
            case 'Rect':
            case 'Poly':
                const p = cachedPath(el);
                ctx.fill(p);
                if (this.doc_.selectedElement == el.id)
                    ctx.stroke(p);
                break;
            default:
                console.error(`unhandled el ${el}`);
        }
        if (mustSave)
            ctx.restore();
    }
    addNewPoly() {
        const poly = {
            type: 'Poly',
            id: this.doc_.nextId++,
            pts: [],
        };
        this.doc_.root.elements.push(poly);
        return poly;
    }
}
