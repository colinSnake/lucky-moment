'use client';
import { useEffect } from "react";
import "./index.css";

const Alert = (props: any) => {
    const { type, title, message } = props;

    useEffect(() => {
        
    }, []);

    return <div className={`main-alert main-alert-${type}`}>
        <div className="alert-title">{title}</div>
        <div className="alert-info">{message}</div>
    </div>
};

export default Alert;
