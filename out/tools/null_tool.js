import { Tool } from "./tool.js";
export class NullTool extends Tool {
    constructor() {
        super(...arguments);
        this.name = 'Null';
    }
}
