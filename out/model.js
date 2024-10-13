import { Camera } from "./camera.js";
import { Renderer } from "./renderer.js";
export class Model {
    constructor() {
        this.cam = new Camera();
        this.renderer = new Renderer();
    }
}
export const model = new Model();
