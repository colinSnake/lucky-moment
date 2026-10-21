import { useState, useEffect } from "react";
import { EventsUtilHelper, LotteryUtilHelper } from "@/module/util";
import { LotteryDataInterface } from "@/module/interface";
import { EventType } from "@/module/enum";
import { beautifulWords } from "@/module/mockData";
import "./index.css";


const FontBg = () => {
    const [words, setWords] = useState<string[]>([]);

    useEffect(() => {
        return EventsUtilHelper.subscribe(EventType.updatePrizes, (data: LotteryDataInterface) => {
            const { prizeIndex } = data;
            const curWord: string = beautifulWords[prizeIndex];
            curWord && setWords([curWord.slice(0, 2), curWord.slice(2)]);
        }, LotteryUtilHelper);
    }, []);

    const renderContent = () => {
        return words.map((word, index) => <span key={index}>{word}</span>);
    }

    return <div className="wl-fontBg">
        {renderContent()}
    </div>
}

export default FontBg;
