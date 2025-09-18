import { StarInterface } from "@/module/interface/index";

export default class StarrySkyUtil {
    canvas: HTMLCanvasElement|null = null;
    drawOffscreenWorker: Worker|null = null;
    img: HTMLImageElement = new Image();
    instanceObj: StarrySkyUtil|null = null;
    constant = {
        starNums: 120,
        focalLength: 0, // 焦距
        centerX: 0,
        centerY: 0,
        offscreenWidth: 120,
        offscreenHeight: 30,
        font: '13px zcoolkangyuyang_w01',
    }
    stars: StarInterface[] = [];
    timer: any = null;
    instance(): StarrySkyUtil{
        if(!this.instanceObj){
            this.instanceObj = new StarrySkyUtil();
        }
        return this.instanceObj;
    }

    initialize(){
        this.canvas = document.querySelector("#starry-sky")!;
        this.updateCanvasSize(this.canvas);
        this.drawOffscreenWorker = new Worker(new URL('./worker/drawOffscreen.worker.ts', import.meta.url));
        const offscreen = this.canvas.transferControlToOffscreen();
        this.drawOffscreenWorker.postMessage({
            type: 'init',
            canvas: offscreen,
            ext: JSON.stringify({
                constant: this.constant,
                stars: this.stars
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

    updateCanvasSize(canvas: HTMLCanvasElement){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.constant.focalLength = canvas.width / 2;
        this.constant.centerX = canvas.width / 2;
        this.constant.centerY = canvas.height / 2;
        this.produceStars();
    }

    produceStars(){
        const canvas = this.canvas!,
            { starNums } = this.constant;
        const textArr = [
            "2025 我们结婚啦", 
            "囍结良缘", "♡", "♥", 
            "佳偶天成", "百年好合", 
            "白头偕老", "琴瑟和鸣",
            "盟结良缘", "白首成约",
            "缔结良缘", "心心相印",
            "凤凰于飞", "同心同德",
        ];
        for(let i = 0; i < starNums; i++){
            const star = {
                x: this.getRandomNum(canvas.width),
                y: this.getRandomNum(canvas.height),
                z: this.getRandomNum(canvas.width),
                word: textArr[i%(textArr.length - 1)],
                // color: "#fff",
                color: `hsl(${Math.random() * 360}, 70%, 60%)`, // 随机颜色
                angle: Math.random() * Math.PI * 2, // 随机初始角度
                speed: (Math.random() - 0.5) * 0.1, // 随机旋转速度，可正可负
            }
            this.stars.push(star);
        }
    }

    drawStars(){
        this.drawOffscreenWorker?.postMessage({type: 'render'});
    }

    getRandomNum(value: number){
        return Math.floor(Math.random() * value);
    }
}

export function create_StarrySkyUtil(){
    return new StarrySkyUtil().instance();
}
