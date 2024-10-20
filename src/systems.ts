import { Camera } from "./camera.js";
import { Model } from "./model.js";
import { Renderer } from "./renderer.js";
import { ToolSystem } from "./tool_system.js";

export class Systems {
    readonly cam = new Camera()
    readonly renderer = new Renderer()
    readonly model = new Model()
    readonly tool = new ToolSystem()
}

export const systems = new Systems()