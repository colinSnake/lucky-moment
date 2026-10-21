import confetti from "canvas-confetti";
import { confettiConstant } from "@/module/mockData";

export default class Confetti {
    animationTime: number = 6000;
    static instanceObj: Confetti|null = null;
    static instance(): Confetti{
        if(!Confetti.instanceObj){
            Confetti.instanceObj = new Confetti();
        }
        return Confetti.instanceObj;
    }
    draw(){
        const { left, center, right } = confettiConstant,
            endTime = Date.now() + this.animationTime;
        const spray = () => {
            if (Date.now() >= endTime) return;
            confetti(left[0]);
            confetti(right[0]);
            window.setTimeout(spray, 140);
        }
        spray();
        for(let k = 0; k < center.length; k++){
            confetti(center[k]);
        }
    }
}
