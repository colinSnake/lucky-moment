export const zh = {
    Page: {
        EnterDraw: '进入抽奖',
        Draw: '抽奖',
        ReDraw: '重新抽奖',
        ExportExcel: '导出 Excel',
        Reset: '重置',
        Pause: '暂停',
        AlertTitle: "提示",
        AlertContent: "这是一段测试文本",
    },
    Common: {
        SpecialPrize: '特等奖',
        FirstPrize: '一等奖',
        SecondPrize: '二等奖',
        ThirdPrize: '三等奖',
        NormalPrize: '阳光普照奖',
        None: '无',
        Congratulations: (ids: string, prize: string) => {
            return `恭喜编号为${ids}的幸运儿, 你们获得了${prize}`;
        },
        Number: "编号",
        Name: "姓名",
        Prize: "等级",
        Gift: "奖品",
        PrizeForm: "获奖名单"
    }
}