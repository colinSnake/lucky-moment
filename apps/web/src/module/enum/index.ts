export enum AlertType{
    info = 'info',
    success = 'success',
    warning = 'warning',
    error = 'error',
}

export enum EventType {
    showAlert = 'SHOW_ALERT',
    updatePrizes = 'UPDATE_PRIZES',
    updateBtnGroup = 'UPDATE_BTN_GROUP',
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
    none = -1, // 未中奖
    specialPrize = 0, // 特等奖
    firstPrize = 1, // 一等奖
    secondPrize = 2, // 二等奖
    thirdPrize = 3, // 三等奖
    normalPrize = 4, // 阳光普照奖
}

export enum StepType {
    welcome = 'welcome',
    lottery = 'lottery',
    reLottery = 'reLottery',
    export = 'export',
    reset = 'reset',
}