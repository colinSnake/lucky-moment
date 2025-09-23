"use client";
import { useEffect } from "react";
import Link from 'next/link';
import { IconSvg } from "..";
import "./index.css";

const Btn = (props: any) => {
    const { name, size = "2.4vh", callback } = props;
    return <div className="expansion-btn">
        <IconSvg config={{name, size, callback}} />
    </div>
}

const Expansion = () => {
    const expansionOption = [
        {name: "icon-gift", callback: () => {}, href: '/gift'},
        {name: "icon-prize", callback: () => {}, href: '/win-list'},
        {name: "icon-setting", callback: () => {}, href: '/setting'}
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
