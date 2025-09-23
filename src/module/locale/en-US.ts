export const en = {
    Page: {
        EnterDraw: 'Enter Draw',
        Draw: 'Draw',
        ReDraw: 'Re-Draw',
        ExportExcel: 'Export Excel',
        Reset: 'Reset',
        Pause: 'Pause',
        AlertTitle: "Tips",
        AlertContent: "This is a test text",
    },
    Common: {
        SpecialPrize: 'Special Prize',
        FirstPrize: 'First Prize',
        SecondPrize: 'Second Prize',
        ThirdPrize: 'Third Prize',
        NormalPrize: 'Normal Prize',
        None: 'No Prize',
        Congratulations: (ids: string, prize: string) => {
            return `Congratulations to the lucky ones with the numbers ${ids}, You have won the ${prize}`;
        },
        LotteryCompleted: "All the prizes for the current event have been drawn. Thank you for your participation",
        Number: "Number",
        Name: "Name",
        Prize: "Prize",
        Gift: "Gift",
        PrizeForm: "Prize Form",
    }
}