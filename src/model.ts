export type Group = {
    type: 'Group'
    elements: Element[],
    fillStyle?: string,
}

export type Rect = {
    type: 'Rect',
    x: number,
    y: number,
    w: number,
    h: number,
}

export type Poly = {
    type: 'Poly',
    xs: number[],
    ys: number[],
}

export type Transformable = {
    transform?: DOMMatrix,
    fillStyle?: string,
}

export type Element = Transformable & (Group | Rect | Poly)

export type Document = {
    root: Group,
    fg: string,
    bg: string,
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
            const xs = el.xs
            const ys = el.ys
            if (xs.length != ys.length) throw `Poly with mismatched xs and ys`
            for (let i = 0; i < xs.length; ++i)
                p.lineTo(xs[i], ys[i])
            break
    }
    return p
}

export class Model {
    readonly doc: Document = {
        root: {
            type: 'Group',
            elements: [
                { type: 'Rect', x: -10, y: -10, w: 20, h: 20 },
                { type: 'Rect', x: 20, y: -10, w: 20, h: 20 },
                { type: 'Rect', x: 50, y: -10, w: 20, h: 20, 'fillStyle': '#f00' },
            ]
        },
        bg: '#fff',
        fg: '#f88',
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
                break
            default:
                console.error(`unhandled el ${el}`)
        }

        if (mustSave) ctx.restore()
    }
}