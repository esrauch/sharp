import { Tool } from "./tool.js";


export class NullTool extends Tool {
    protected override enableInternal() { }
}