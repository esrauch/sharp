export type XY = {
    x: number,
    y: number,
}

export type BaseElement = {
    id: number,
    transform?: DOMMatrix,
    fillStyle?: string,
}

export type Group = BaseElement & {
    type: 'Group'
    elements: Element[],
    fillStyle?: string,
}

export type Rect = BaseElement & {
    type: 'Rect',
    x: number,
    y: number,
    w: number,
    h: number,
}

export type Poly = BaseElement & {
    type: 'Poly',
    pts: XY[],
}

export type Element = Group | Rect | Poly

export type Document = {
    root: Group,
    fg: string,
    bg: string,
    nextId: number,  // No element with Id >= this value has ever existed.
    selectedElement?: number
}

const pathCache = new WeakMap<Element, Path2D>();

function cachedPath(el: Rect | Poly) {
    const cached = pathCache.get(el)
    if (cached) return cached;

    const p = new Path2D()
    switch (el.type) {
        case 'Rect':
            p.rect(el.x, el.y, el.w, el.h)
            break
        case 'Poly':
            for (const pt of el.pts)
                p.lineTo(pt.x, pt.y)
            break
    }
    return p
}

export class Model {
    readonly doc: Document = {
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
    }

    render(ctx: CanvasRenderingContext2D) {
        const bounds = new Path2D()
        bounds.rect(0, 0, 1080, 1080)

        ctx.fillStyle = this.doc.bg
        ctx.fill(bounds)

        ctx.clip(bounds)
        ctx.fillStyle = this.doc.fg
        this.renderElement(ctx, this.doc.root)
    }

    private renderElement(ctx: CanvasRenderingContext2D, el: Element) {
        const mustSave = el.transform || el.fillStyle

        if (mustSave) ctx.save()

        if (el.transform) {
            ctx.setTransform(ctx.getTransform().multiply(el.transform))
        }

        if (el.fillStyle) ctx.fillStyle = el.fillStyle

        switch (el.type) {
            case 'Group':
                for (const child of el.elements) this.renderElement(ctx, child)
                break
            case 'Rect':
            case 'Poly':
                const p = cachedPath(el)
                ctx.fill(p)

                if (this.doc.selectedElement == el.id)
                    ctx.stroke(p)
                break
            default:
                console.error(`unhandled el ${el}`)
        }

        if (mustSave) ctx.restore()
    }

    addNewPoly(): Poly {
        const poly: Poly = {
            type: 'Poly',
            id: this.doc.nextId++,
            pts: [],
        }
        this.doc.root.elements.push(poly)
        return poly
    }
}