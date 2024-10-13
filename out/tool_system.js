import { NullTool } from "./tools/null_tool.js";
import { PanTool } from "./tools/pan_tool.js";
import { PolyTool } from "./tools/poly_tool.js";
const TOOLS = new Map();
{
    function addTool(t) { TOOLS.set(t.name, t); }
    addTool(new NullTool());
    addTool(new PanTool());
    addTool(new PolyTool());
}
export class ToolSystem {
    constructor() {
        this.active = new NullTool();
        this.active.enable();
    }
    activeTool() {
        return this.active;
    }
    switchTool(newTool) {
        this.active.disable();
        this.active = newTool;
        newTool.enable();
    }
    activateToolNamed(name) {
        const newTool = TOOLS.get(name);
        if (!newTool) {
            console.error('no tool named', name);
            return;
        }
        this.switchTool(newTool);
    }
}
