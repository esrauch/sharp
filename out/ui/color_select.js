import { systems } from "../systems.js";
export class ColorSelect {
    register() {
        const fg = document.querySelector('.fg');
        fg.setAttribute('value', systems.model.doc().fg);
        fg.addEventListener('input', () => {
            systems.model.doc().fg = fg.value;
        });
        const bg = document.querySelector('.bg');
        bg.setAttribute('value', systems.model.doc().bg);
        bg.addEventListener('input', () => {
            systems.model.doc().bg = bg.value;
        });
    }
}
