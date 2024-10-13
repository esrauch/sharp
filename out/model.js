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
        this.doc = {
            root: {
                type: 'Group',
                id: 0,
                elements: [
                    { id: 1, type: 'Rect', x: -10, y: -10, w: 20, h: 20 },
                    { id: 2, type: 'Rect', x: 20, y: -10, w: 20, h: 20 },
                    { id: 3, type: 'Rect', x: 50, y: -10, w: 20, h: 20, 'fillStyle': '#f00' },
                ]
            },
            bg: '#fff',
            fg: '#f88',
            nextId: 0,
        };
    }
    render(ctx) {
        const bounds = new Path2D();
        bounds.rect(0, 0, 1080, 1080);
        ctx.fillStyle = this.doc.bg;
        ctx.fill(bounds);
        ctx.clip(bounds);
        ctx.fillStyle = this.doc.fg;
        this.renderElement(ctx, this.doc.root);
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
                if (this.doc.selectedElement == el.id)
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
            id: this.doc.nextId++,
            pts: [],
        };
        this.doc.root.elements.push(poly);
        return poly;
    }
}
