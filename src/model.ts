
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

export type Transformable = {
    transform?: DOMMatrix,
    fillStyle?: string,
}

export type Element = Transformable & (Group | Rect)

export type Document = {
    root: Group,
    fg: string,
    bg: string,
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
        const mustSave = el.transform || (el.fillStyle !== ctx.fillStyle)

        if (mustSave) ctx.save()

        if (el.transform) {
            ctx.setTransform(ctx.getTransform().multiply(el.transform))
        }

        if (el.fillStyle) ctx.fillStyle = el.fillStyle

        switch (el.type) {
            case "Group":
                for (const child of el.elements) this.renderElement(ctx, child)
                break
            case "Rect":
                ctx.fillRect(el.x, el.y, el.w, el.h)
                break
        }

        if (mustSave) ctx.restore()
    }
}