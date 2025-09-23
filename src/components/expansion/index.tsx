"use client";
import { useEffect } from "react";
import Link from 'next/link';
import { IconSvg } from "..";
import "./index.css";

const Btn = (props: any) => {
    const { name, size = "2.4vh", isLast } = props;
    return <div className={`expansion-btn ${isLast ? "nmb" : ""}`}>
        <IconSvg config={{name, size}} />
    </div>
}

const Expansion = () => {
    const expansionOption = [
        {name: "icon-gift", href: '/gift'},
        {name: "icon-prize", href: '/win-list'},
        {name: "icon-setting", href: '/setting', isLast: true}
    ];

    useEffect(() => {
        
    }, []);

    return <div className="main-expansion-wrapper">
        <div className="main-expansion-inner">
            {expansionOption.map((it: any) => <Link href={it.href} key={it.name}>
                <Btn key={it.name} {...it} />
            </Link>)}
        </div>
    </div>  
};

export default Expansion;
