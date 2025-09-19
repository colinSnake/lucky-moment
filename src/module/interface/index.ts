import { PrizeType } from "../enum";

export interface LotteryDataInterface {
    lotteryId: string; // 抽奖编号
    prizes: PrizeInterface[]; // 奖品列表
    prizesCount: number[]; // 奖品数量列表
    prizeIndex: number; // 当前抽奖奖品索引
    users: UserInterface[]; // 用户列表
    isShowTable: boolean; // 是否显示平面卡片
    isLottery: boolean; // 是否抽奖中
}

export interface PrizeInterface {
    id: number; // 奖品编号
    name: string; // 奖品名称
    amount: number; // 奖品金额
    count: number; // 奖品已中奖数量
    cover: string; // 奖品封面
    total: number; // 奖品总数  
    type: PrizeType; // 奖品类型
    isActive?: boolean; // 是否选中（是否处于当前抽奖阶段）
}

export interface StarInterface {
    x: number;
    y: number;
    z: number;
    word: string;
    color: string;
    angle: number;
    speed: number;
}

export interface UserInterface {
    id: number; // 用户编号
    isWin: boolean; // 是否中奖过 
    isInPrize: boolean; // 是否中奖
    name?: string; // 用户姓名
    gift?: PrizeType; // 中奖 level
}
