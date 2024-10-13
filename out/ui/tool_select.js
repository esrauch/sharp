import { systems } from "../systems.js";
export class ToolSelect {
    register() {
        const toolBtns = Array.from(document.querySelectorAll('.toolBtn'));
        const activeTool = systems.tool.activeTool();
        for (const t of toolBtns) {
            const name = t.getAttribute('data-tool-name');
            if (name == activeTool.name) {
                t.classList.add('activeTool');
            }
            t.addEventListener('click', () => {
                systems.tool.activateToolNamed(name);
            });
        }
    }
}
