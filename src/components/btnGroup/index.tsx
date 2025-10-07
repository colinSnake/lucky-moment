"use client";
import { useEffect, useState, useCallback } from "react";
import { EventType, StepType } from "@/module/enum";
import { create_lotteryUtil } from "@/module/util/lotteryUtil";
import EventsUtil from "@/module/util/eventsUtil";
import Locale from "@/module/locale";
import "./index.css";

const Btn = (props: any) => {
    const { type, text, isVisible, isActive, isMLR, isLetterSpacing } = props;

    const handleBtnClick = async() => {
        await create_lotteryUtil().main({type, text});
    }

    return <div className={`btn-box ${isVisible ? "visible" : ""} ${isActive ? "active" : ""} ${isMLR ? "mlr" : ""}`} onClick={handleBtnClick}>
        <button className={`btn ${isLetterSpacing ? "btn-ls" : ""}`}>{text}</button>
        <div className="icon-flower"></div>
    </div>
}

const BtnGroup = () => {
    const [btns, setBtns] = useState([]);
    const btnOptions: any = [
        { type: StepType.welcome, text: Locale.Page.EnterDraw, isVisible: true },
        { type: StepType.lottery, text: Locale.Page.Draw, isVisible: false, isActive: true, isLetterSpacing: true },
        { type: StepType.reLottery, text: Locale.Page.ReDraw, isVisible: false, isMLR: true },
        { type: StepType.reset, text: Locale.Page.Reset, isVisible: false, isLetterSpacing: true },
    ];

    const handleAction = useCallback(() => {
        EventsUtil.subscribe(EventType.updateBtnGroup, (params: any) => {
            const { isShowTable, isShowPause, type } = params;
            const newBtnsOptions = btnOptions.map((it: any) => {
                if(it.type === StepType.welcome){
                    it.isVisible = isShowTable;
                }else{
                    it.isVisible = !isShowTable;
                }
                if(it.type === type && type === StepType.lottery){
                    it.text = Locale.Page[!isShowPause ? 'Draw' : 'Pause'];
                }else if(it.type === type && type === StepType.reLottery){
                    it.text = Locale.Page[!isShowPause ? 'ReDraw' : 'Pause'];
                }
                return it;
            });
            setBtns(newBtnsOptions);
        }, create_lotteryUtil());
    }, [btnOptions]); 

    useEffect(() => {
        handleAction();
    }, [handleAction]);


    return (
        <div className="main-btns">
            { btns.map((it: any) => <Btn key={it.type} {...it} />)}
        </div>
    )
}

export default BtnGroup;
