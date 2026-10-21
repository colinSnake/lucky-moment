import { useEffect, useState } from "react";
import { EventType, StepType } from "@/module/enum";
import { EventsUtilHelper, LotteryUtilHelper } from "@/module/util";
import Locale from "@/module/locale";
import "./index.css";

const initialButtons = [
    { type: StepType.welcome, text: Locale.Page.EnterDraw, isVisible: true },
    { type: StepType.lottery, text: Locale.Page.Draw, isVisible: false, isActive: true, isLetterSpacing: true },
    { type: StepType.reLottery, text: Locale.Page.ReDraw, isVisible: false, isMLR: true },
    { type: StepType.reset, text: Locale.Page.Reset, isVisible: false, isLetterSpacing: true },
];

const Btn = (props: any) => {
    const { type, text, isVisible, isActive, isMLR, isLetterSpacing } = props;

    const handleBtnClick = async() => {
        await LotteryUtilHelper.main({type, text});
    }

    const setClassName = () => {
        let className = "btn-box";
        if(isVisible){
            className += " visible";
            isMLR && (className += " mlr");
        }
        isActive && (className += " active");
        return className;
    }

    return <div className={setClassName()} onClick={handleBtnClick}>
        <button className={`btn${isLetterSpacing ? " btn-ls" : ""}`}>{text}</button>
        <div className="icon-flower"></div>
    </div>
}

const BtnGroup = () => {
    const [btns, setBtns] = useState(initialButtons);

    useEffect(() => {
        return EventsUtilHelper.subscribe(EventType.updateBtnGroup, (params: any) => {
            const { isShowTable, isShowPause, type } = params;
            const newBtnsOptions = initialButtons.map((it) => {
                let text = it.text;
                if(it.type === StepType.welcome){
                    return { ...it, isVisible: isShowTable };
                }
                if(it.type === type && type === StepType.lottery){
                    text = Locale.Page[!isShowPause ? 'Draw' : 'Pause'];
                }else if(it.type === type && type === StepType.reLottery){
                    text = Locale.Page[!isShowPause ? 'ReDraw' : 'Pause'];
                }
                return { ...it, text, isVisible: !isShowTable };
            });
            setBtns(newBtnsOptions);
        }, LotteryUtilHelper);
    }, []);


    return (
        <div className="wl-btns">
            { btns.map((it: any) => <Btn key={it.type} {...it} />)}
        </div>
    )
}

export default BtnGroup;
