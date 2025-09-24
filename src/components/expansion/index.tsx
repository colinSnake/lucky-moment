"use client";
import { useEffect } from "react";
import Link from 'next/link';
import { create_lotteryUtil } from "@/module/util/lotteryUtil";
import { IconSvg } from "..";
import "./index.css";

const Btn = (props: any) => {
    const { name, href, size = "2.4vh", isUpload, isLast } = props;

    const handleUpload = async(e: any) => {
       await create_lotteryUtil().importExcel(e.target.files[0]);
       e.target.value = "";
    }
    
    return <div className={`expansion-btn ${isLast ? "nmb" : ""}`}>
        {href ? <Link href={href}><IconSvg config={{name, size}} /></Link> : <IconSvg config={{name, size}} />}
        {isUpload && <input type="file" accept="xlsx/xls" onChange={handleUpload} />}
    </div>
}

const Expansion = () => {
    const expansionOption = [
        {name: "icon-upload", href: '', isUpload: true},
        {name: "icon-gift", href: '/gift'},
        {name: "icon-prize", href: '/win-list'},
        {name: "icon-setting", href: '/setting', isLast: true}
    ];

    useEffect(() => {
        
    }, []);

    return <div className="main-expansion-wrapper">
        <div className="main-expansion-inner">
            {expansionOption.map((it: any) => <Btn key={it.name} {...it} />)}
        </div>
    </div>  
};

export default Expansion;
