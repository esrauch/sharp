import { NullTool } from "./tools/null_tool.js";
import { PanTool } from "./tools/pan_tool.js";
import { PolyTool } from "./tools/poly_tool.js";
import { Tool } from "./tools/tool.js";


const TOOLS = {
    'Null': new NullTool(),
    'Pan': new PanTool(),
    'PolyTool': new PolyTool(),
}

export class ToolSystem {
    activeTool: Tool = new PolyTool()

    constructor() {
        this.activeTool.enable()
    }

    switchTool(newTool: Tool) {
        this.activeTool.disable()
        this.activeTool = newTool
        newTool.enable()
    }
}