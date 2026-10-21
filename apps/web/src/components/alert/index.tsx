import { useState, useEffect, useRef } from "react";
import { IconSvg } from "../";
import { EventsUtilHelper, LotteryUtilHelper } from "@/module/util";
import { AlertType, EventType } from "@/module/enum";
import { AlertInfoInterface } from "@/module/interface";
import Locale from "@/module/locale";
import "./index.css";

const Alert = () => {
    const [alertInfo, setAlertInfo] = useState<AlertInfoInterface>({
        type: AlertType.success,
        title: Locale.Page.AlertTitle,
        message: Locale.Page.AlertContent,
        position: "top",
        isShow: false,
    });
    const alertRef = useRef<HTMLDivElement>(null);

    const setStyleCssText = () => {
        if (!alertRef.current) return;
        alertRef.current.style.cssText = "";
        if(alertInfo.position === "top"){
            alertRef.current!.style.cssText = `left: calc(50% - ${alertRef.current!.offsetWidth / 2}px)`;
        }
    }

    useEffect(() => {
        return EventsUtilHelper.subscribe(EventType.showAlert, (data: AlertInfoInterface) => {
            setAlertInfo((current) => ({...current, ...data}));
        }, LotteryUtilHelper);
    }, []);

    useEffect(() => {
        setStyleCssText();
    }, [alertInfo]);

    const setClassName = () => {
        const { position, isShow } = alertInfo;
        let className = `wl-alert-wrapper ${position}`;
        isShow && (className += " active");
        return className;
    }

    return <div ref={alertRef} className={setClassName()}>
        <div className={`wl-alert-inner ${alertInfo.type}`}>
            <div className="alert-title">{alertInfo.title}</div>
            <div className="alert-info">{alertInfo.message}</div>
            <IconSvg config={{name: "icon-close", callback: () => setAlertInfo({...alertInfo, isShow: false})}} />
        </div>
    </div>  
};

export default Alert;
