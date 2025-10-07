"use client";
import { useEffect, useState, useCallback } from "react";
import EventsUtil from "@/module/util/eventsUtil";
import Util from "@/module/util";
import { create_lotteryUtil } from "@/module/util/lotteryUtil";
import { LotteryDataInterface, PrizeInterface } from "@/module/interface";
import { EventType } from "@/module/enum";
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

const PrizeCards = () => {
    const [prizeIndex, setPrizeIndex] = useState(0);
    const [prizes, setPrizes] = useState<PrizeInterface[]>([]);

    const handleAction = useCallback(() => {
        EventsUtil.subscribe(EventType.updatePrizes, (lotteryData: LotteryDataInterface) => {
            setPrizeIndex(lotteryData.prizeIndex);
            setPrizes([...lotteryData.prizes]);
        }, create_lotteryUtil());
    }, [prizeIndex, prizes]);

    useEffect(() => {
        handleAction();
    }, [handleAction]);

    return <div className="main-prizes-cards">
        {prizes.map((it, idx) => (<Card key={it.id} {...Object.assign(it, {isActive: prizeIndex === idx})} />))}
    </div>  
}

export default PrizeCards;
