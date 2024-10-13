const canvas = document.querySelector('canvas')!

export function trueSizeCanvas() {
    canvas.width = Math.max(1, parseInt(getComputedStyle(canvas).width)) * devicePixelRatio
    canvas.height = Math.max(1, parseInt(getComputedStyle(canvas).height)) * devicePixelRatio
}

async function start() {
    trueSizeCanvas()
    new ResizeObserver(trueSizeCanvas).observe(canvas)

}

start()