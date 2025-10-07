"use client";
import { useEffect } from "react";
import Link from 'next/link';
import { create_lotteryUtil } from "@/module/util/lotteryUtil";
import { imgs } from "@/module/mockData";
import "./index.css";

const Btn = (props: any) => {
    const { name, href, size = "2.4vh", className, isImport, isExport, isLast } = props;

    const handleExport = async() => {
        isExport && await create_lotteryUtil().exportExcel();
    }

    const handleImport = async(e: any) => {
       await create_lotteryUtil().importExcel(e.target.files[0]);
       e.target.value = "";
    }
    
    return <div className={`btn-expansion ${className} ${isLast ? "nmb" : ""}`} onClick={handleExport}>
        {/* {href ? <Link href={href}><IconSvg config={{name, size}} /></Link> : <IconSvg config={{name, size}} />} */}
        {isImport && <input type="file" accept="xlsx/xls" onChange={handleImport} />}
    </div>
}

const Expansion = () => {
    const expansionOption = [
        {name: imgs.iconImport, className: "btn-import", isImport: true},
        {name: imgs.iconExport, className: "btn-export", isExport: true},
        // {name: "icon-gift", href: '/gift'},
        // {name: "icon-prize", href: '/win-list'},
        // {name: "icon-setting", href: '/setting', isLast: true}
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
