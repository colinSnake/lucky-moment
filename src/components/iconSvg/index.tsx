"use client";   

type PropsType = {
    config: {
        name: string,
        size?: number,
        title?: string,
        callback?: Function,
        className?: string,
        isPropagation?: boolean
    }
}

const IconSvg = (props: PropsType) => {
    const { name, size = 20, title = '', callback, className, isPropagation } = props.config;

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
            style={{width: `${size}px`, height: `${size}px`}} title={title} 
            onClick={handleCallback}
        >
        <svg className='icon-svg' aria-hidden="true" style={{width: `${size}px`, height: `${size}px`}}>
            <use xlinkHref={`#${name}`}></use>
        </svg>
    </div>   
}

export default IconSvg;
