import { Camera } from "./camera.js";
import { Input } from "./input/input.js";
import { Model } from "./model.js";
import { Renderer } from "./renderer.js";

export class Systems {
    readonly cam = new Camera()
    readonly renderer = new Renderer()
    readonly input = new Input()
    readonly model = new Model()

    constructor() {
        this.cam.addListener(() => this.renderer.render())
    }
}

export const systems = new Systems()