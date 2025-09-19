import { StarInterface } from "@/module/interface/index";

export default class StarrySkyUtil {
    canvas: HTMLCanvasElement|null = null;
    ctx: CanvasRenderingContext2D|null = null;
    offscreenCanvas: OffscreenCanvas|null = null;
    offscreenCtx: OffscreenCanvasRenderingContext2D|null = null;
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
        const { offscreenWidth, offscreenHeight } = this.constant;
        this.canvas = document.querySelector("#starry-sky")!;
        this.ctx = this.canvas.getContext("2d");
        this.offscreenCanvas = new OffscreenCanvas(offscreenWidth, offscreenHeight);
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.updateCanvasSize(this.canvas);
        this.render();
    }

    render(){
        // this.drawStars();
        this.drawStarsSec();
        this.updateStars();
        window.requestAnimationFrame(this.render.bind(this));
        // this.timer = setTimeout(() => {
        //     clearTimeout(this.timer);
        //     this.timer = null;
        //     this.render();
        // }, 1000 / 40);
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
            "2025", "我们结婚啦", 
            "LM & MRX",
            "囍结良缘", "♡", "♥", 
            "佳偶天成", "百年好合", 
            "白头偕老", "琴瑟和鸣",
            "盟结良缘", "白首成约",
            "缔结良缘", "心心相印",
            "凤凰于飞", "同心同德",
            "山水一程", "风雨一更",
            "三生有幸", "共度余生",
            "不偏不倚", "刚好是你",
            "既许一人以偏爱", "愿尽余生之慷慨","年年岁岁不相负", "落日与晚风", "朝朝又暮暮",
            "愿我们始于初见", "止于终老", "以爱之名", "以余生为期", "喜悦有分享", "同量天地宽", "相随日月长",
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
        const canvas = this.canvas!,
            ctx = this.ctx!,
            { focalLength, centerX, centerY, font } = this.constant;
            ctx.font = font;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < this.stars.length; i++){
            const star = this.stars[i],
                { x, y, z, word, color } = star;

            let px = (x - centerX) * (focalLength / z);
            px += centerX;
            let py = (y - centerY) * (focalLength / z);
            py += centerY;
            ctx.fillStyle = color;
            ctx.fillText(word, px, py);
        }
    }

    drawStarsSec(){
        const canvas = this.canvas!,
            ctx = this.ctx!,
            { focalLength, centerX, centerY, offscreenWidth, offscreenHeight } = this.constant;

        // 1. 清除整个画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. 遍历并绘制每一个单字
        for (let i = 0; i < this.stars.length; i++) {
            const char = this.stars[i],
                { x, y, z, word, color, angle, speed } = char;

            // 设置颜色并绘制文本（离屏渲染）
            this.drawWord(word, color);

            let px = (x - centerX) * (focalLength / z);
            px += centerX;
            let py = (y - centerY) * (focalLength / z);
            py += centerY;
            
            // 保存当前画布状态
            ctx.save(); 

            // 移动到当前单字的中心点
            ctx.translate(px, py);

            // 旋转画布
            ctx.rotate(angle);

            // 绘制图像时，需偏移使得图像中心与旋转中心重合
            ctx.drawImage(this.offscreenCanvas!, -offscreenWidth / 2, -offscreenHeight / 2);

            // 恢复画布状态，避免影响下一个单字的绘制
            ctx.restore();

            // 更新旋转角度以供下一帧使用
            char.angle += speed;
        }
    }

    /**
     * @description 在离屏Canvas上绘制静态文本
     */
    drawWord(word: string, color: string){
        const { offscreenWidth, offscreenHeight, font } = this.constant,
            offScreenCtx = this.offscreenCtx!;
        offScreenCtx.font = font;
        offScreenCtx.textAlign = 'center';
        offScreenCtx.textBaseline = 'middle';
        offScreenCtx.fillStyle = color;
        offScreenCtx.clearRect(0, 0, offscreenWidth, offscreenHeight);
        offScreenCtx.fillText(word, offscreenWidth / 2, offscreenHeight / 2);
    }

    updateStars(){
        for(let i = 0; i < this.stars.length; i++){
            const star = this.stars[i];
            star.z -= 3;
            if(star.z <= 0){
                star.z = this.canvas!.width;
            }
        }
    }

    getRandomNum(value: number){
        return Math.floor(Math.random() * value);
    }
}

export function create_StarrySkyUtil(){
    return new StarrySkyUtil().instance();
}
