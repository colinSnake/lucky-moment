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
        LotteryCompleted: "The current lottery activity has ended. Thank you for your participation",
        Lotterying: "The current lottery activity is in progress, and the user list cannot be updated",
        LotteryError: "Lottery failed, please try again later",
        NoLotteryUsers: "The current lottery activity has no users to be drawn",
        UploadSuccess: "User list upload successful",
        UploadFailed: "User list upload failed",
        Number: "Number",
        Name: "Name",
        Prize: "Prize",
        Gift: "Gift",
        Date: "Date",
        PrizeForm: "Prize Form",
    }
}