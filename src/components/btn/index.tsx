'use client';
import { useEffect, useState } from "react";
import { EventType, StepType } from "@/module/enum";
import { create_LotteryUtil } from "@/module/util/lotteryUtil";
import EventsUtil from "@/module/util/eventsUtil";
import Locale from "@/module/locale";

const Btn = (props: any) => {
    const { type, text } = props;

    const handleBtnClick = async() => {
        await create_LotteryUtil().main(type);
    }

    return <button className="btn" onClick={handleBtnClick}>{text}</button>
}

const Btns = () => {
    const [btns, setBtns] = useState([]);
    const btnOptions: any = [
        { type: StepType.welcome, text: Locale.Page.EnterDraw },
        { type: StepType.lottery, text: Locale.Page.Draw },
        { type: StepType.reLottery, text: Locale.Page.ReDraw },
        { type: StepType.export, text: Locale.Page.ExportExcel },
        { type: StepType.reset, text: Locale.Page.Reset },
    ]

    useEffect(() => {
        EventsUtil.subscribe(EventType.updateBtns, (status: boolean) => {
            setBtns(btnOptions.filter((it: any) => (status ? it.type === StepType.welcome : it.type !== StepType.welcome)));
        }, create_LotteryUtil());
    }, []);


    return (
        <div className="main-btns">
            { btns.map((it: any) => <Btn key={it.type} {...it} />)}
        </div>
    )
}

export default Btns;
