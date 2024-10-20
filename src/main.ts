import { systems } from "./systems.js"
import { ColorSelect } from "./ui/color_select.js"
import { ToolSelect } from "./ui/tool_select.js"

async function start() {
    systems.renderer.render()
    new ToolSelect().register()
    new ColorSelect().register()
}

start()