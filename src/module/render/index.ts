import RenderConfetti from "./renderConfetti";
import RenderSparticle from "./renderSparticle";
import RenderText from "./renderText";
// import RenderText from "./renderTextSec";

export function create_renderConfetti(){
    return new RenderConfetti().instance();
}

export function create_renderSparticle(){
    return new RenderSparticle().instance();
}

export function create_renderText(){
    return new RenderText().instance();
}

export {
    RenderConfetti,
    RenderSparticle,
    RenderText
}