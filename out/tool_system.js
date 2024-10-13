import { NullTool } from "./tools/null_tool.js";
import { PanTool } from "./tools/pan_tool.js";
import { PolyTool } from "./tools/poly_tool.js";
const TOOLS = {
    'Null': new NullTool(),
    'Pan': new PanTool(),
    'PolyTool': new PolyTool(),
};
export class ToolSystem {
    constructor() {
        this.activeTool = new PolyTool();
        this.activeTool.enable();
    }
    switchTool(newTool) {
        this.activeTool.disable();
        this.activeTool = newTool;
        newTool.enable();
    }
}
