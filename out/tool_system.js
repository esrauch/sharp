import { NullTool } from "./tools/null_tool.js";
import { PanTool } from "./tools/pan_tool.js";
const TOOLS = {
    'Null': new NullTool(),
    'Pan': new PanTool()
};
export class ToolSystem {
    constructor() {
        this.activeTool = new PanTool();
        this.activeTool.enable();
    }
    switchTool(newTool) {
        this.activeTool.disable();
        this.activeTool = newTool;
        newTool.enable();
    }
}
