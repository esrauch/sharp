import { Tool } from "./tool.js";
import { canvas } from "../dom.js"
import { systems } from "../systems.js";


export class PanTool extends Tool {
    protected override enableInternal(signal: AbortSignal): void {
        canvas.addEventListener('click', onMouseClick, { signal })
        canvas.addEventListener('mousewheel', onMouseWheel, { signal })
        canvas.addEventListener('mousemove', onMouseMove, { signal })
        canvas.addEventListener('touchstart', onTouchStart, { signal })
        canvas.addEventListener('touchend', onTouchEnd, { signal })
        canvas.addEventListener('touchcancel', onTouchCancel, { signal })
        canvas.addEventListener('touchmove', onTouchMove, { signal })
    }
}

type XY = { x: number, y: number }

function xyForMouseEvent(evt: MouseEvent): XY {
    return {
        x: evt.offsetX * devicePixelRatio,
        y: evt.offsetY * devicePixelRatio
    }
}

function onMouseClick(evt: Event) {
    const e = evt as MouseEvent
    const center = systems.cam.mapInverse(xyForMouseEvent(e))
    console.log(center)
}


function onMouseWheel(evt: Event) {
    const e = evt as WheelEvent

    const center = systems.cam.mapInverse(xyForMouseEvent(e))
    systems.cam.zoom(1 - e.deltaY / 1000, center)
    evt.preventDefault()
}

function onMouseMove(evt: MouseEvent) {
    if (evt.buttons == 0) return
    const delta = systems.cam.mapInverseDelta({ x: evt.movementX * devicePixelRatio, y: evt.movementY * devicePixelRatio })
    systems.cam.pan(delta)
    evt.preventDefault()
}


function xyForTouch(t: Touch): XY {
    const bcr = (t.target as Element).getBoundingClientRect()
    const x = t.clientX * devicePixelRatio - bcr.x
    const y = t.clientY * devicePixelRatio - bcr.y
    return { x, y }
}

function xyDist(a: XY, b: XY): number {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
}

function avgDist(list: XY[], to: XY): number {
    let sum = 0
    for (const xy of list) {
        sum += xyDist(xy, to)
    }
    return sum / list.length
}

const touches = new Map<number, XY>()

function updateTouches(e: TouchEvent) {
    touches.clear()
    for (let i = 0; i < e.touches.length; ++i) {
        const t = e.touches.item(i)!
        touches.set(t.identifier, xyForTouch(t))
    }
}

function onTouchStart(e: TouchEvent) {
    e.preventDefault()
    updateTouches(e)
}

function onTouchMove(e: TouchEvent) {
    e.preventDefault()
    const ts = e.touches
    const cam = systems.cam

    if (ts.length == 0) {
        console.error('move with 0 touches?')
        return
    }

    if (ts.length == 1) {
        const t = ts.item(0)!
        const newXy = xyForTouch(t)
        const oldXy = touches.get(t.identifier)
        if (touches.size !== 1 || !oldXy) {
            console.error('bad touch state :(')
            return
        }
        const deltaPx = { x: newXy.x - oldXy.x, y: newXy.y - oldXy.y }
        const delta = cam.mapInverseDelta(deltaPx)
        cam.pan(delta)
        updateTouches(e)
        return
    }

    // Multifinger gesture
    const num = ts.length
    if (num != touches.size) {
        console.error('move where touch count mismatch', ts, touches)
        return
    }

    const newXys = []
    for (let i = 0; i < ts.length; ++i) {
        newXys.push(xyForTouch(ts.item(i)!))
    }

    const newSum =
        newXys.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }))
    const newCenter = { x: newSum.x / num, y: newSum.y / num }

    const oldXys = [...touches.values()]
    const oldSum =
        oldXys.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }))
    const oldCenter = { x: oldSum.x / num, y: oldSum.y / num }

    const deltaPx = { x: newCenter.x - oldCenter.x, y: newCenter.y - oldCenter.y }
    const delta = cam.mapInverseDelta(deltaPx)
    cam.pan(delta)

    // The zoom amount is determined by the ratio between:
    // - The average distance between the center and each of the touches before
    // - The same for the touches now
    const oldAvgDist = avgDist(oldXys, oldCenter)
    const newAvgDist = avgDist(newXys, newCenter)
    cam.zoom(oldAvgDist / newAvgDist, cam.mapInverse(newCenter))

    updateTouches(e)
}

function onTouchEnd(e: TouchEvent) {
    e.preventDefault()
    for (let i = 0; i < e.changedTouches.length; ++i) {
        const t = e.changedTouches.item(i)!
        touches.delete(t.identifier)
    }
}
function onTouchCancel(e: TouchEvent) {
    e.preventDefault()
    for (let i = 0; i < e.changedTouches.length; ++i) {
        const t = e.changedTouches.item(i)!
        touches.delete(t.identifier)
    }
}