import { AlertType, PrizeType } from "../enum";

export interface AlertInfoInterface {
    type: AlertType, // 弹窗类型（info | success | warning | error）
    title?: string, // 弹窗标题
    message: string, // 弹窗内容
    position: "top" | "right", // 弹窗位置（top | right）
    isShow: boolean, // 是否显示弹窗
    isAutoClose?: boolean, // 是否自动关闭弹窗
    duration?: number, // 弹窗显示时间（单位：毫秒）
}

export interface LotteryDataInterface {
    lotteryId: string; // 抽奖编号
    prizes: PrizeInterface[]; // 奖品列表
    prizesCount: number[]; // 奖品数量列表
    prizeIndex: number; // 当前抽奖奖品索引
    users: UserInterface[]; // 用户列表
    participantIds?: number[]; // 明确的参选编号；未设置时兼容按编号范围参选
    isShowTable: boolean; // 是否显示平面卡片
    isLottery: boolean; // 是否抽奖中
}

export interface PrizeInterface {
    id: number; // 奖品编号
    name: string; // 奖品名称
    amount: number; // 奖品金额
    count: number; // 奖品已中奖数量
    total: number; // 奖品总数  
    type: PrizeType; // 奖品类型
    isActive?: boolean; // 是否选中（是否处于当前抽奖阶段）
}

export interface UserInterface {
    id: number; // 用户编号
    isWin: boolean; // 是否中奖过 
    isInPrize: boolean; // 是否中奖
    order: number; // 中奖顺序
    name: string; // 用户姓名
    gift: PrizeType; // 奖品 level
    date: string; // 中奖日期
}
