"use client";
import { useState, useEffect, useCallback } from "react";
import EventsUtil from "@/module/util/eventsUtil";
import { create_lotteryUtil } from "@/module/util/lotteryUtil";
import { LotteryDataInterface } from "@/module/interface";
import { EventType } from "@/module/enum";
import { beautifulWords } from "@/module/mockData";
import "./index.css";


const FontBg = () => {
    const [words, setWords] = useState<string[]>([]);

    const handleAction = useCallback(() => {
        EventsUtil.subscribe(EventType.updatePrizes, (data: LotteryDataInterface) => {
            const { prizeIndex } = data;
            const curWord: string = beautifulWords[prizeIndex];
            curWord && setWords([curWord.slice(0, 2), curWord.slice(2)]);
        }, create_lotteryUtil());
    }, [words]);

    useEffect(() => {
        handleAction();
    }, [handleAction]);

    const renderContent = () => {
        return words.map((word, index) => <span key={index}>{word}</span>);
    }

    return <div className="wl-fontBg">
        {renderContent()}
    </div>
}

export default FontBg;