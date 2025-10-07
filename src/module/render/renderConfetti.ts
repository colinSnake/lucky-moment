import confetti from "canvas-confetti";
import { confettiConstant } from "@/module/mockData";

export default class RenderConfetti {
    animationTime: number = 3000;
    instanceObj: RenderConfetti|null = null;
    instance(): RenderConfetti{
        if(!this.instanceObj){
            this.instanceObj = new RenderConfetti();
        }
        return this.instanceObj;
    }
    draw(){
        const { left, center, right } = confettiConstant,
            endTime = Date.now() + this.animationTime
        const frame = () => {
            confetti(left[0]);
            confetti(right[0]);
            if(Date.now() < endTime){
                requestAnimationFrame(frame);
            }
        }
        frame();
        for(let k = 0; k < center.length; k++){
            confetti(center[k]);
        }
    }
}
