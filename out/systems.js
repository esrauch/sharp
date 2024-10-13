import { Camera } from "./camera.js";
import { Input } from "./input/input.js";
import { Renderer } from "./renderer.js";
export class Systems {
    constructor() {
        this.cam = new Camera();
        this.renderer = new Renderer();
        this.input = new Input();
        this.cam.addListener(() => this.renderer.render());
    }
}
export const systems = new Systems();
