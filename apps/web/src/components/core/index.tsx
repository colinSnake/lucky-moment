
import { useEffect } from "react";
import { LotteryUtilHelper } from "@/module/util";
import "./index.css";
let initialization: Promise<void> | null = null;

const Core = () => {
    useEffect(() => {
        initialization ??= LotteryUtilHelper.initialize();
    }, []);

    return (
        <div className="core" id="lottery-core-container"></div>
    )
}

export default Core;
