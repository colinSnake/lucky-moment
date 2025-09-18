export enum EventType {
    updatePrizes = 'UPDATE_PRIZES',
    updateBtns = 'UPDATE_BTNS',
}

export enum IndexedDBQueryType {
    primary = 'primary',
    index = 'index'
}

export enum IndexedDBStatusType {
    readonly = 'readonly',
    readwrite = 'readwrite',
    versionChange = 'versionChange',
    prev = 'prev',
    prevunique = 'prevunique',
    next = 'next',
    nextunique = 'nextunique'
}

export enum LocaleType {
    zh_CN = 'zh',
    en_US = 'en',
}

export enum ObjectStoreIndexType {
    lotteryId = 'lotteryId',
}

export enum PrizeType {
    specialPrize, // 特等奖
    firstPrize, // 一等奖
    secondPrize, // 二等奖
    thirdPrize, // 三等奖
    normalPrize, // 阳光普照奖
}

export enum StepType {
    welcome = 'welcome',
    lottery = 'lottery',
    reLottery = 'reLottery',
    export = 'export',
    reset = 'reset',
}