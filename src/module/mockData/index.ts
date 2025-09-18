import { PrizeType } from "../enum";
import { LotteryDataInterface, PrizeInterface } from "../interface";
export const lotteryId = "cb85ae949eda1fb233816fca52bbd974";
export const imgs = {
    dh_font_white_icon: "../../../images/double_happiness_font_white.png",
    dh_small_icon: "../../../images/double_happiness_small.png",
}
export const config =  {
    row: 6, // 卡片行数
    col: 13, // 卡片列数
    resolution: 1, // 分辨率
    resetDuration: 500, // 重置卡片动画时间
    selectDuration: 600, // 选择卡片动画时间
    transformDuration: 2000, // 卡片平面和3D切换状态动画时间
    rotateDuration: 3000, // 旋转 sphere 动画时间
    width: 210, // 卡片宽度
    height: 240, // 卡片高度
    step: 20, // 卡片间距
};
export const prizes: PrizeInterface[] = [
    {
        id: 0, 
        name: "智能空气炸锅",
        amount: 500,
        count: 0,
        cover: "/images/mbp.jpg",
        total: 1,  
        type: PrizeType.specialPrize
    },
    {
        id: 1, 
        name: "蓝牙降噪耳机",
        amount: 200,
        count: 0,
        cover: "/images/mbp.jpg",
        total: 3,  
        type: PrizeType.firstPrize
    },
    {
        id: 2, 
        name: "高颜值餐具礼盒",
        amount: 80,
        count: 0,
        cover: "/images/mbp.jpg",
        total: 6,  
        type: PrizeType.secondPrize
    },
    {
        id: 3, 
        name: "星空夜灯",
        amount: 50,
        count: 0,
        cover: "/images/mbp.jpg",
        total: 10,   
        type: PrizeType.thirdPrize
    },
    {
        id: 4, 
        name: "手机挂件",
        amount: 20,
        count: 0,
        cover: "/images/mbp.jpg",
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
            index: i,
            name: `用户${i}`,
            gift: "",
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
