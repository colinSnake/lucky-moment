import confetti from "canvas-confetti";
import { confettiConstant } from "@/module/mockData";

export default class Confetti {
    animationTime: number = 3000;
    static instanceObj: Confetti|null = null;
    static instance(): Confetti{
        if(!Confetti.instanceObj){
            Confetti.instanceObj = new Confetti();
        }
        return Confetti.instanceObj;
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
