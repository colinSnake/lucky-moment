
"use client";
import { useEffect } from "react";
import { create_lotteryUtil } from "@/module/util/lotteryUtil";
import "./index.css";
let isCreated = false;

const Core = () => {
    useEffect(() => {
        if (!isCreated) {
            create_lotteryUtil().initialize();
            isCreated = true;
        }
    }, []);

    return (
        <div className="core" id="lottery-core-container"></div>
    )
}

export default Core;