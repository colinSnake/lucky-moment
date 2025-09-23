"use client";
import { useEffect, useState } from "react";
import { EventType, StepType } from "@/module/enum";
import { create_LotteryUtil } from "@/module/util/lotteryUtil";
import EventsUtil from "@/module/util/eventsUtil";
import Locale from "@/module/locale";
import "./index.css";

const Btn = (props: any) => {
    const { type, text } = props;

    const handleBtnClick = async() => {
        await create_LotteryUtil().main({type, text});
    }

    return <button className="btn" onClick={handleBtnClick}>{text}</button>
}

const BtnGroup = () => {
    const [btns, setBtns] = useState([]);
    const btnOptions: any = [
        { type: StepType.welcome, text: Locale.Page.EnterDraw },
        { type: StepType.lottery, text: Locale.Page.Draw },
        { type: StepType.reLottery, text: Locale.Page.ReDraw },
        { type: StepType.export, text: Locale.Page.ExportExcel },
        { type: StepType.reset, text: Locale.Page.Reset },
    ];

    useEffect(() => {
        EventsUtil.subscribe(EventType.updateBtnGroup, (params: any) => {
            const { isShowTable, isShowPause, type } = params;
            const newBtnsOptions = btnOptions.map((it: any) => {
                if(it.type === type && type === StepType.lottery){
                    it.text = Locale.Page[!isShowPause ? 'Draw' : 'Pause'];
                }else if(it.type === type && type === StepType.reLottery){
                    it.text = Locale.Page[!isShowPause ? 'ReDraw' : 'Pause'];
                }
                return it;
            }).filter((it: any) => (isShowTable ? it.type === StepType.welcome : it.type !== StepType.welcome))
            setBtns(newBtnsOptions);
        }, create_LotteryUtil());
    }, []);


    return (
        <div className="main-btns">
            { btns.map((it: any) => <Btn key={it.type} {...it} />)}
        </div>
    )
}

export default BtnGroup;
