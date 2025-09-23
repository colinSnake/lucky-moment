"use client";
import { useState, useEffect } from "react";
import { IconSvg } from "../";
import EventsUtil from "@/module/util/eventsUtil";
import { create_LotteryUtil } from "@/module/util/lotteryUtil";
import { AlertType, EventType } from "@/module/enum";
import { AlertInfoInterface } from "@/module/interface";
import Locale from "@/module/locale";
import "./index.css";

const Alert = () => {
    const [alertInfo, setAlertInfo] = useState<AlertInfoInterface>({
        type: AlertType.info,
        title: Locale.Page.AlertTitle,
        message: Locale.Page.AlertContent,
        isShow: false,
        isAutoClose: true,
        duration: 3000,
    });

    useEffect(() => {
        EventsUtil.subscribe(EventType.showAlert, (data: AlertInfoInterface) => {
            setAlertInfo({...alertInfo, ...data});
            handleAutoClose();
        }, create_LotteryUtil());
    }, []);

    const handleAutoClose = () => {
        if (alertInfo.isAutoClose) {
            let timer: any = setTimeout(() => {
                setAlertInfo({...alertInfo, isShow: false});
                clearTimeout(timer);
                timer = null;
            }, alertInfo.duration);
        }
    }

    return <div className={`main-alert-wrapper top ${alertInfo.isShow ? "active" : ""}`}>
        <div className={`main-alert-inner ${alertInfo.type}`}>
            <div className="alert-title">{alertInfo.title}</div>
            <div className="alert-info">{alertInfo.message}</div>
            <IconSvg config={{name: "icon-close"}} />
        </div>
    </div>  
};

export default Alert;
