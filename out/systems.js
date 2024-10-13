import { Camera } from "./camera.js";
import { Input } from "./input/input.js";
import { Model } from "./model.js";
import { Renderer } from "./renderer.js";
export class Systems {
    constructor() {
        this.cam = new Camera();
        this.renderer = new Renderer();
        this.input = new Input();
        this.model = new Model();
        this.cam.addListener(() => this.renderer.render());
    }
}
export const systems = new Systems();
