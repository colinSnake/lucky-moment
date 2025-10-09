export const en = {
    Page: {
        EnterDraw: 'Enter Draw',
        Draw: 'Draw',
        ReDraw: 'Re-Draw',
        ExportExcel: 'Export Excel',
        Reset: 'Reset',
        Pause: 'Pause',
        AlertTitle: "Tips",
        AlertContent: "This is a default text",
        LN_01: "Currently extracting ",
        LN_02: "with",
        LN_03: "items remaining",
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
        LotteryNotice: (name: string) => {
            return `Currently extracting ${name}, please adjust your pose`
        },
        LotteryCompleted: "The current lottery activity has ended. Thank you for your participation",
        LotteryUnderway: "The current lottery activity is in progress, and the user list cannot be updated",
        LotteryCarryOut: "The current lottery activity has not been initiated, and cannot be redrawn",
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