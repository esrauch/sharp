import { systems } from "./systems.js"
import { ToolSelect } from "./ui/tool_select.js"

async function start() {
    systems.renderer.render()
    new ToolSelect().register()
}

start()