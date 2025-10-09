"use client";
import { useEffect, useState, useCallback } from "react";
import EventsUtil from "@/module/util/eventsUtil";
import Util from "@/module/util";
import { create_lotteryUtil } from "@/module/util/lotteryUtil";
import { LotteryDataInterface, PrizeInterface } from "@/module/interface";
import { EventType } from "@/module/enum";
import Locale from "@/module/locale";
import "./index.css";

const Card = (props: PrizeInterface) => {
    const { name, count, total, type } = props;

    return (
        <div className={`card ${count > 0 && count < total ? 'active' : ''}`}>
            <div className="card-inner">
                <div className="card-box card-cover"></div>
                <div className="card-box card-body">
                    <div className="card-title">{`${Util.getPrizeName(type)}`}</div>
                    <div className="card-content">
                        <b>{name}</b>
                        <span>{`(${total-count}/${total})`}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

const GiftCards = () => {
    const [notice, setNotice] = useState<any>(null);
    const [cards, setCards] = useState<PrizeInterface[]>([]);

    const handleAction = useCallback(() => {
        EventsUtil.subscribe(EventType.updatePrizes, (lotteryData: LotteryDataInterface) => {
            const { prizes, prizeIndex } = lotteryData;
            const newPrizes = prizes.map((it) => ({...it, isActive: it.id === prizeIndex})),
                curPrize = newPrizes.find((it) => it.isActive) as PrizeInterface;
            const { type, name, count, total } = curPrize;
            setNotice({ level: Util.getPrizeName(type), name, remainCount: total - count });
            setCards([...newPrizes]);
        }, create_lotteryUtil());
    }, [notice, cards]);

    useEffect(() => {
        handleAction();
    }, [handleAction]);

    const renderNotice = () => {
            const { name, level, remainCount } = notice;
            return <div className="notice">
                <span>{Locale.Page.LN_01}</span>
                <h2>{level}</h2> 
                <h2 className="plr">{name}</h2>
                <span>{`，${Locale.Page.LN_02}`}</span> 
                <h2 className="plr">{remainCount}</h2> 
                <span>{Locale.Page.LN_03}</span>
            </div>;
        }

    return <div className="wl-gift-cards">
        {notice && renderNotice()}
        {cards.map((it) => (<Card key={it.id} {...it} />))}
    </div>  
}

export default GiftCards;
