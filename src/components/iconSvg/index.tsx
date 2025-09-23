"use client";  
import { useEffect } from "react";
import "./index.css";

type PropsType = {
    config: {
        name: string,
        size?: string,
        title?: string,
        callback?: Function,
        className?: string,
        isPropagation?: boolean
    }
}

const IconSvg = (props: PropsType) => {
    const { name, size = '20px', title = '', callback, className, isPropagation } = props.config;

    useEffect(() => {
        if(typeof window !== undefined){
            require('../../../public/iconfont/iconfont.js');
        }
    }, []);

    const handleCallback = (e: any) => {
        if(callback){
            if(!isPropagation){
                e.stopPropagation();
            }
            callback();
        }
    }
    
    return <div 
            className={ className ? `iconBox-${className} iconBox` : 'iconBox'} 
            style={{width: `${size}`, height: `${size}`}} title={title} 
            onClick={handleCallback}
        >
        <svg className='icon-svg' aria-hidden="true" style={{width: `${size}`, height: `${size}`}}>
            <use xlinkHref={`#${name}`}></use>
        </svg>
    </div>   
}

export default IconSvg;
