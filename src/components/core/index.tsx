
"use client";
import { useEffect } from "react";
import { LotteryUtilHelper } from "@/module/util";
import "./index.css";
let isCreated = false;

const Core = () => {
    useEffect(() => {
        if (!isCreated) {
            LotteryUtilHelper.initialize();
            isCreated = true;
        }
    }, []);

    return (
        <div className="core" id="lottery-core-container"></div>
    )
}

export default Core;