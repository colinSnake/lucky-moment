import RenderConfetti from "./renderConfetti";
import RenderStar from "./renderStar";
import RenderText from "./renderText";
// import RenderText from "./renderTextSec";

export function create_renderText(){
    return new RenderText().instance();
}

export function create_renderConfetti(){
    return new RenderConfetti().instance();
}

export {
    RenderConfetti,
    RenderStar,
    RenderText
}