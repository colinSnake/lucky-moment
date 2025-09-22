"use client";
import { useState, useRef } from "react";
import { IconSvg } from "../";
import "./index.css";

type Props = {
    config: {
        popupTitle: string,
        popupClass: string,
        popupContent: any,
        width?: number,
        height?: number,
    }
}

let mouseMoveEvent: any = null;
let mouseUpEvent: any = null;

const popupWindow = (props: Props) => {
    const { popupTitle, popupClass, popupContent, width = 960, height = 540 } = props.config,
        wrapRef: any = useRef(null),
        bodyWidth = document.body.clientWidth,
        bodyHeight = document.body.clientHeight;
    const [styleConfig, setStyleConfig] = useState<any>({
        width,
        height: height + 40,
        left: (bodyWidth - width) / 2,
        top: (bodyHeight - height) / 2,
    });

    const getBoundary = (offsetX: number, offsetY: number) => {
        let left = styleConfig.left + offsetX,
            top = styleConfig.top + offsetY;
        const sw = 10,
            sh = 50,
            [bw, bh] = [document.body.offsetWidth, document.body.offsetHeight],
            [minLeft, maxLeft] = [sw, bw - styleConfig.width - sw],
            [minTop, maxTop] = [sh, bh - styleConfig.height - sh];
        left = left < minLeft ? minLeft : left > maxLeft? maxLeft : left;
        top = top < minTop ? minTop : top > maxTop? maxTop : top;
        return [left, top];
    }

    const hanleMouseEnter = (e: any) => {
        if (e.currentTarget.style) {
            e.currentTarget.style.cursor = 'move';
        }
    }

    const handleMouseDown = (e: any) => {
        const startPoint = { x: e.clientX, y: e.clientY };

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);

        function move(ev: any) {
            ev.stopPropagation();
            const currentPoint = { x: ev.clientX, y: ev.clientY },
                offsetX = currentPoint.x - startPoint.x,
                offsetY = currentPoint.y - startPoint.y,
                [left, top] = getBoundary(offsetX, offsetY);

            setStyleConfig({
                width: styleConfig.width,
                height: styleConfig.height,
                left,
                top,
            });
            mouseMoveEvent = move;
            mouseUpEvent = up;
        }

        function up(ev: any) {
            ev.stopPropagation();
            mouseMoveEvent = move;
            mouseUpEvent = up;
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        }
    }

    const handleMouseUp = (e: any) => {
        if (e.currentTarget.style) {
            e.currentTarget.style.cursor = 'auto';
            mouseMoveEvent && document.removeEventListener('mousemove', mouseMoveEvent); 
            mouseUpEvent && document.removeEventListener('mouseup', mouseUpEvent);
            mouseMoveEvent = null;
            mouseUpEvent = null;
        }
    }

    const handleClose = () => {
        const wrapEle = wrapRef.current!;
        wrapEle && wrapEle.classList.contains("active") && wrapEle.classList.remove("active");
    }

    return <div className={`popupWindowWrapper ${popupClass}`} ref={wrapRef}>
        <div className="popupWindowInner">
            <div className="popupWindowBox" style={styleConfig}>
                <div className="head" onMouseEnter={ hanleMouseEnter } onMouseDown={ handleMouseDown } onMouseUp={ handleMouseUp }>
                    <h4>{popupTitle}</h4>
                    <IconSvg config={{name: "icon-close", size: 24, callback: handleClose}}/>
                </div>
                <div className="body" style={{width, height}}>
                    {popupContent}
                </div> 
            </div>
        </div>
    </div>
}

export default popupWindow;
