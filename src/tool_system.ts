import { NullTool } from "./tools/null_tool.js";
import { PanTool } from "./tools/pan_tool.js";
import { PolyTool } from "./tools/poly_tool.js";
import { Tool } from "./tools/tool.js";

const TOOLS = new Map<string, Tool>()

{
    function addTool(t: Tool) { TOOLS.set(t.name, t) }
    addTool(new NullTool())
    addTool(new PanTool())
    addTool(new PolyTool())
}

export class ToolSystem {
    private active: Tool = new NullTool()

    constructor() {
        this.active.enable()
    }

    activeTool(): Tool {
        return this.active
    }

    private switchTool(newTool: Tool) {
        this.active.disable()
        this.active = newTool
        newTool.enable()
    }

    activateToolNamed(name: string) {
        const newTool = TOOLS.get(name)
        if (!newTool) {
            console.error('no tool named', name)
            return
        }
        this.switchTool(newTool)
    }
}