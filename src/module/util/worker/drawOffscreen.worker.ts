let drawOffscreenWorker: any = null; 

class DrawOffscreenWorker {
    constant: any = null;
    words: any[] = [];
    canvas: OffscreenCanvas|null = null;
    ctx: OffscreenCanvasRenderingContext2D|null = null; 
    offscreenCanvas: OffscreenCanvas|null = null;
    offscreenCtx: OffscreenCanvasRenderingContext2D|null = null;
    constructor(canvas: OffscreenCanvas, ext: any) {
        const { constant, words } = ext,
            { offscreenWidth, offscreenHeight } = constant;
        this.constant = constant;
        this.words = words;
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d')!;
        this.offscreenCanvas = new OffscreenCanvas(offscreenWidth, offscreenHeight);
        this.offscreenCtx = this.offscreenCanvas.getContext('2d')!;
    }

    render(){
        const canvas = this.canvas!,
            ctx = this.ctx!,
            { focalLength, centerX, centerY, offscreenWidth, offscreenHeight } = this.constant;

        // 1. 清除整个画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 2. 遍历并绘制每一个单字
        for (let i = 0; i < this.words.length; i++) {
            const char = this.words[i],
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

            // 更新单字的 z 坐标，用于控制深度
            char.z -= 3;
            if(char.z <= 0){
                char.z = this.canvas!.width;
            }
        }
    }

    drawWord(word: string, color: string){
        const { offscreenWidth, offscreenHeight, font } = this.constant,
            offscreenCtx = this.offscreenCtx!;
        offscreenCtx.font = font;
        offscreenCtx.textAlign = 'center';
        offscreenCtx.textBaseline = 'middle';
        offscreenCtx.fillStyle = color;        
        offscreenCtx.clearRect(0, 0, offscreenWidth, offscreenHeight);
        offscreenCtx.fillText(word, offscreenWidth / 2, offscreenHeight / 2);
    }

    resize(params: any){
        const { width, height } = params;
        this.canvas!.width = width;
        this.canvas!.height = height;
        this.render();
    }
}

self.onmessage = (e) => {
    const { type, canvas, ext } = e.data;
    switch(type){
        case "init":
            drawOffscreenWorker = new DrawOffscreenWorker(canvas, JSON.parse(ext));
            break;
        case 'render':
            drawOffscreenWorker.render();
            break;
        case 'resize':
            drawOffscreenWorker.resize(ext);
            break;
        default:
            break;
    }
}