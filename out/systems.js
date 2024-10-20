import { Camera } from "./camera.js";
import { Model } from "./model.js";
import { Renderer } from "./renderer.js";
import { ToolSystem } from "./tool_system.js";
export class Systems {
    constructor() {
        this.cam = new Camera();
        this.renderer = new Renderer();
        this.model = new Model();
        this.tool = new ToolSystem();
    }
}
export const systems = new Systems();
