import { initMouse } from "./mouse.js";
import { initTouch } from "./touch.js";
export class Input {
    constructor() {
        initMouse();
        initTouch();
    }
}
