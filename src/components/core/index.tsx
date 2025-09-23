
"use client";
import { useEffect } from "react";
import { create_LotteryUtil } from "@/module/util/lotteryUtil";
import "./index.css";
let isCreated = false;

const Core = () => {
    useEffect(() => {
        if (!isCreated) {
            create_LotteryUtil().initialize();
            isCreated = true;
        }
    }, []);

    return (
        <div className="core" id="lottery-core-container"></div>
    )
}

export default Core;