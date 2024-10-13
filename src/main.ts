import { systems } from "./systems.js"

async function start() {
    systems.renderer.render()
}

start()