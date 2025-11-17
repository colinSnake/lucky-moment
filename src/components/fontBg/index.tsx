"use client";
import { useState, useEffect, useCallback } from "react";
import { EventsUtilHelper, LotteryUtilHelper } from "@/module/util";
import { LotteryDataInterface } from "@/module/interface";
import { EventType } from "@/module/enum";
import { beautifulWords } from "@/module/mockData";
import "./index.css";


const FontBg = () => {
    const [words, setWords] = useState<string[]>([]);

    const handleAction = useCallback(() => {
        EventsUtilHelper.subscribe(EventType.updatePrizes, (data: LotteryDataInterface) => {
            const { prizeIndex } = data;
            const curWord: string = beautifulWords[prizeIndex];
            curWord && setWords([curWord.slice(0, 2), curWord.slice(2)]);
        }, LotteryUtilHelper);
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