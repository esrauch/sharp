import { Camera } from "./camera.js";
import { Input } from "./input/input.js";
import { Renderer } from "./renderer.js";

export class Systems {
    cam = new Camera()
    renderer = new Renderer()
    input = new Input()

    constructor() {
        this.cam.addListener(() => this.renderer.render())
    }
}

export const systems = new Systems()