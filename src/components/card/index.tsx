"use client";
import { useEffect, useState, useCallback } from "react";
import EventsUtil from "@/module/util/eventsUtil";
import { create_LotteryUtil } from "@/module/util/lotteryUtil";
import { LotteryDataInterface, PrizeInterface } from "@/module/interface";
import { EventType, PrizeType } from "@/module/enum";
import "./index.css";

const Card = (props: PrizeInterface) => {
    const { name, count, cover, total, type, isActive } = props;

    const getTitle = () => {
        let level = '';
        switch (type) {
            case PrizeType.specialPrize:
                level = '特等奖';
                break;
            case PrizeType.firstPrize:
                level = '一等奖';
                break;
            case PrizeType.secondPrize:
                level = '二等奖';
                break;
            case PrizeType.thirdPrize:
                level = '三等奖';
                break;
            default:
                level = '阳光普照奖';
                break;
        }
        return `${level} ${name}`;
    }

    return (
        <div className={`card ${isActive ? 'active' : ''}`}>
            <div className="card-inner">
                <div className="card-box card-cover">
                    {cover && <img src={cover} alt="奖品封面" />}
                </div>
                <div className="card-box">
                    <div className="card-title">{getTitle()}</div>
                    <div className="card-content">
                        <span>{total-count}/{total}</span>
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
        }, create_LotteryUtil());
    }, [prizeIndex, prizes]);

    useEffect(() => {
        handleAction();
    }, [handleAction]);

    return <div className="main-prizes-cards">
        {prizes.map((it, idx) => (<Card key={it.id} {...Object.assign(it, {isActive: prizeIndex === idx})} />))}
    </div>  
}

export default PrizeCards;
