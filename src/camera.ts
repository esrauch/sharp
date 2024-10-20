import { canvas } from "./dom.js"
import { systems } from "./systems.js"

const MAX_RENDER_SCALE = 20
const MIN_RENDER_SCALE = 0.5

export class Camera {
    top = 1080
    right = 1080
    left = 0
    bottom = 0

    canvasw = 0
    canvash = 0
    renderscale = 0

    constructor() {
        requestAnimationFrame(() => {
            this.canvasw = canvas.width
            this.canvash = canvas.height
            this.trueSizeCanvas()
            new ResizeObserver(() => this.trueSizeCanvas()).observe(canvas)
            this.fixRenderScale();
        })
    }

    trueSizeCanvas() {
        canvas.width = Math.max(1, parseInt(getComputedStyle(canvas).width)) * devicePixelRatio
        canvas.height = Math.max(1, parseInt(getComputedStyle(canvas).height)) * devicePixelRatio
        this.updateCanvasWH()

    }

    updateCanvasWH() {
        this.canvasw = canvas.width
        this.canvash = canvas.height
        this.fixRenderScale()
        systems.renderer.renderImmediate()
    }

    fixRenderScale() {
        const minx = this.left
        const maxx = this.right
        this.renderscale = this.canvasw / (maxx - minx)

        // Just to avoid some enormous jump doing a bad thing, also cap here
        this.renderscale = Math.min(this.renderscale, MAX_RENDER_SCALE)
        this.renderscale = Math.max(this.renderscale, MIN_RENDER_SCALE)

        systems.renderer.render()
    }

    getTransform(): DOMMatrix {
        return new DOMMatrix().
            scale(this.renderscale, this.renderscale).
            translate(-this.left, -this.bottom)
    }

    // Maps from lat/long to screen px
    map(pt: { x: number, y: number }): { x: number, y: number } {
        const p = new DOMPoint(pt.x, pt.y)
        return this.getTransform().transformPoint(p)
    }


    // Maps a lat/long _difference_ to a screen px difference
    mapDelta(pt: { x: number, y: number }): { x: number, y: number } {
        return { x: pt.x * this.renderscale, y: pt.y * this.renderscale }
    }

    // Maps from screen px to lat/long
    mapInverse(pt: { x: number, y: number }): { x: number, y: number } {
        return this.getTransform().inverse().transformPoint(pt)
    }

    // Maps a screen px _difference_ to a lat/lon difference
    mapInverseDelta(pt: { x: number, y: number }): { x: number, y: number } {
        return { x: pt.x / this.renderscale, y: pt.y / this.renderscale }
    }

    zoom(mult: number, zoom_center?: { x: number, y: number }) {
        if (this.renderscale >= MAX_RENDER_SCALE && mult < 1) return
        if (this.renderscale <= MIN_RENDER_SCALE && mult > 1) return

        let [miny, minx, maxy, maxx] = [this.top, this.left, this.bottom, this.right]
        const w = maxx - minx
        const h = maxy - miny

        const center = {
            x: minx + (maxx - minx) / 2,
            y: miny + (maxy - miny) / 2
        }
        if (!zoom_center) {
            zoom_center = center
        }
        const { zcx, zcy } = { zcx: zoom_center.x, zcy: zoom_center.y }

        // We attribute a _portion_ of the zoom mult based on where the zoom_center is
        // relative to the current center.
        // For example, zoom_center left is in the center then we want to apply it equally to left and right
        // If the zoom center is all the way on the left, then it should only move _right_
        // Anything between is linearly interpolated
        const portion_left = (zcx - minx) / w
        const portion_right = 1 - portion_left
        const portion_top = (zcy - miny) / h
        const portion_bot = 1 - portion_top

        const wdelta = (w * mult) - w
        const hdelta = (h * mult) - h

        minx -= (wdelta * portion_left)
        miny -= (hdelta * portion_top)
        maxx += (wdelta * portion_right)
        maxy += (hdelta * portion_bot)

        this.top = miny
        this.left = minx
        this.bottom = maxy
        this.right = maxx
        this.fixRenderScale()
    }

    pan(delta: { x: number, y: number }) {
        const { dx, dy } = { dx: delta.x, dy: delta.y }
        this.top -= dy
        this.bottom -= dy
        this.left -= dx
        this.right -= dx
        this.fixRenderScale()
    }

    zoomIn() {
        this.zoom(1 / 1.1)
    }

    zoomOut() {
        this.zoom(1.1)
    }
}
