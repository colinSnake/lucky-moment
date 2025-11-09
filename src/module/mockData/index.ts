import { PrizeType } from "../enum";
import { beautifulWords, loveWords, wishWords } from "./words";
import { LotteryDataInterface, PrizeInterface, TextRenderConstantInterface } from "../interface";
export const lotteryId = "cb85ae949eda1fb233816fca52bbd974";
export const colors = ["#13c2c2","#ff4466", "#ffb415"];
export const colorsSec = ["#FF5E5E", "#FFBD5E", "#5EFF6B", "#5E8FFF", "#D45EFF", "#FF5EC2"];
export const imgs = {
    iconImport: "../../../images/btn-import.png",
    iconExport: "../../../images/btn-export.png",
}
export const audios = {
    bg: "../../music/lottery-bg.mp3",
    play: "../../music/lottery-start.mp3",
}
export const config =  {
    row: 7, // 卡片行数
    col: 15, // 卡片列数
    participantsCount: 7 * 15, // 参与者人数
    resolution: 1, // 分辨率
    resetDuration: 500, // 重置卡片动画时间
    selectDuration: 600, // 选择卡片动画时间
    transformDuration: 2000, // 卡片平面和3D切换状态动画时间
    rotateDuration: 3000, // 旋转 sphere 动画时间
    width: 240, // 卡片宽度
    height: 240, // 卡片高度
    step: 20, // 卡片间距
    isShowFont: true, // 卡片是否显示字体
    isAuto: false, // 抽奖是否自动停止
    times: 0, // 旋转次数
    cameraConfig: {
        fov: 50, // 相机视野角度，调整渲染物体的大小
        near: 0.1, // 相机近裁剪面，距离小于near的物体不可见
        far: 10000, // 相机远裁剪面，距离大于far的物体不可见
        aspect: 1, // 相机宽高比
        posZ: 3000, // 相机位置 z 轴
    }
};
export const prizes: PrizeInterface[] = [
    {
        id: 0, 
        name: "鸿运巅峰包",
        amount: 500,
        count: 0,
        total: 1,  
        type: PrizeType.specialPrize
    },
    {
        id: 1, 
        name: "锦鲤非凡包",
        amount: 200,
        count: 0,
        total: 3,  
        type: PrizeType.firstPrize
    },
    {
        id: 2, 
        name: "好运连连包",
        amount: 80,
        count: 0,
        total: 6,  
        type: PrizeType.secondPrize
    },
    {
        id: 3, 
        name: "乐在其中包",
        amount: 50,
        count: 0,
        total: 10,   
        type: PrizeType.thirdPrize
    },
    {
        id: 4, 
        name: "天天开心包",
        amount: 20,
        count: 0,
        total: 20,  
        type: PrizeType.normalPrize
    },
];
const getUsers = () => {
    const users = [],
        { row, col } = config;
    for (let i = 0; i < (row * col); i++) {
        users.push({
            id: i+1,
            isWin: false,
            isInPrize: false,
            order: i,
            name: `用户${i+1}`,
            gift: PrizeType.none,
            date: ""
        });
    }
    return users;
};
export const mockData: LotteryDataInterface = {
    lotteryId,
    prizes,
    prizesCount: [1, 1, 3, 5, 5],
    prizeIndex: prizes.length - 1,
    users: getUsers(),
    isShowTable: true,
    isLottery: false,
};

export const textRenderConstant: TextRenderConstantInterface = {
    wordNumber: 120,
    focalLength: 0, // 焦距
    centerX: 0,
    centerY: 0,
    offscreenWidth: 120,
    offscreenHeight: 30,
    font: '20px baotuxiaobaiti',
}

export const confettiConstant = {
    left: [{ particleCount: 3, angle: 60, spread: 55, colors, origin: { x: 0 }}],
    center: [
        { particleCount: 50, spread: 26, startVelocity: 55, colors, origin: { y: 0.7 } },
        { particleCount: 40, spread: 60, origin: { y: 0.7 } },
        { particleCount: 70,  spread: 100, decay: 0.91, scalar: 0.8, colors, origin: { y: 0.7 } },
        { particleCount: 20,  spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors, origin: { y: 0.7 } },
        { particleCount: 20,  spread: 120, startVelocity: 45, colors, origin: { y: 0.7 } },
    ],
    right: [{ particleCount: 3, angle: 120, spread: 55, colors, origin: { x: 1 }}],
}

export {
    beautifulWords,
    loveWords,
    wishWords
}
