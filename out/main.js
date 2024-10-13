var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const canvas = document.querySelector('canvas');
export function trueSizeCanvas() {
    canvas.width = Math.max(1, parseInt(getComputedStyle(canvas).width)) * devicePixelRatio;
    canvas.height = Math.max(1, parseInt(getComputedStyle(canvas).height)) * devicePixelRatio;
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        trueSizeCanvas();
        new ResizeObserver(trueSizeCanvas).observe(canvas);
    });
}
start();
