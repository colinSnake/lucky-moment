export const en = {
    Page: {
        EnterDraw: 'Enter Draw',
        Draw: 'Draw',
        ReDraw: 'Re-Draw',
        ExportExcel: 'Export Excel',
        Reset: 'Reset',
        Pause: 'Pause',
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
        Number: "Number",
        Name: "Name",
        Prize: "Prize",
        Gift: "Gift",
        PrizeForm: "Prize Form",
    }
}