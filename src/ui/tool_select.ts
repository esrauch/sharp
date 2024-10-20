import { systems } from "../systems.js"


export class ToolSelect {
    register() {
        const activeTool = systems.tool.activeTool()
        const toolBtns = Array.from(document.querySelectorAll('.toolBtn'))
        for (const t of toolBtns) {
            const name = t.getAttribute('data-tool-name')!
            if (name == activeTool.name)
                t.classList.add('activeTool')
            t.addEventListener('click', () => {
                systems.tool.activateToolNamed(name)
            })
        }

        systems.tool.addListener(() => {
            const n = systems.tool.activeTool().name
            for (const t of toolBtns) {
                const name = t.getAttribute('data-tool-name')!
                t.classList.toggle('activeTool', name == n)
            }
        })
    }
}