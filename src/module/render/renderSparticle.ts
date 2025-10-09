import Sparticles from "sparticles";
import { colors } from "@/module/mockData";

export default class RenderSparticle {
    instanceObj: RenderSparticle|null = null;
    instance(): RenderSparticle{
        if(!this.instanceObj){
            this.instanceObj = new RenderSparticle();
        }
        return this.instanceObj;
    }
    draw(){
        const sparticleEle = document.querySelector('.wl-inner-sparticle') as HTMLElement;
        if(sparticleEle){
            const { offsetWidth, offsetHeight } = sparticleEle;
            new Sparticles(sparticleEle, { color: colors, shape: ['star'], count: 120, speed: 15 }, offsetWidth, offsetHeight);
        }
    }
}
