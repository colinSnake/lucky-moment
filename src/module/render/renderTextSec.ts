import { WordInterface, TextRenderConstantInterface } from "@/module/interface";
import { textRenderConstant, loveWords } from "@/module/mockData";

export default class RenderText {
    canvas: HTMLCanvasElement|null = null;
    drawOffscreenWorker: Worker|null = null;
    img: HTMLImageElement = new Image();
    instanceObj: RenderText|null = null;
    constant: TextRenderConstantInterface = textRenderConstant;
    words: WordInterface[] = [];
    timer: any = null;
    instance(): RenderText{
        if(!this.instanceObj){
            this.instanceObj = new RenderText();
        }
        return this.instanceObj;
    }

    initialize(){
        this.canvas = document.querySelector("#starry-sky")!;
        this.updateCanvasSize(true);
        this.drawOffscreenWorker = new Worker(new URL('./worker/drawOffscreen.worker.ts', import.meta.url));
        const offscreen = this.canvas.transferControlToOffscreen();
        this.drawOffscreenWorker.postMessage({
            type: 'init',
            canvas: offscreen,
            ext: JSON.stringify({
                constant: this.constant,
                words: this.words
            })
        }, [offscreen]);
        this.render();
    }

    render(){
        this.drawStars();
        // window.requestAnimationFrame(this.render.bind(this));
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            this.timer = null;
            this.render();
        }, 100);
    }

    updateCanvasSize(isUpdate?: boolean){
        if(isUpdate){
            const canvas = this.canvas!
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const [width, height] = [window.innerWidth, window.innerHeight];
            this.drawOffscreenWorker?.postMessage({
                type: 'resize',
                width,
                height,
            });
            this.constant.focalLength = width / 2;
            this.constant.centerX = width / 2;
            this.constant.centerY = height / 2;
            this.produceStars();
        }
    }

    produceStars(){
        const canvas = this.canvas!,
            { wordNumber } = this.constant;
        this.words = [];
        for(let i = 0; i < wordNumber; i++){
            const star = {
                x: this.getRandomNum(canvas.width),
                y: this.getRandomNum(canvas.height),
                z: this.getRandomNum(canvas.width),
                word: loveWords[i%(loveWords.length - 1)],
                // color: "#fff",
                color: `hsl(${Math.random() * 360}, 70%, 60%)`, // 随机颜色
                angle: Math.random() * Math.PI * 2, // 随机初始角度
                speed: (Math.random() - 0.5) * 0.1, // 随机旋转速度，可正可负
            }
            this.words.push(star);
        }
    }

    drawStars(){
        this.drawOffscreenWorker?.postMessage({type: 'render'});
    }

    getRandomNum(value: number){
        return Math.floor(Math.random() * value);
    }
}
