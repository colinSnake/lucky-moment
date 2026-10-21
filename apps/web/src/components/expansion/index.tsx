import { useState } from "react";
import { VoiceUtilHelper, LotteryUtilHelper } from "@/module/util";
import "./index.css";

const Btn = (props: any) => {
    const {className, callback } = props;
    const accept = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

    return <div className={`btn-expansion ${className}`} onClick={callback}>
        {/* {href ? <Link href={href}><IconSvg config={{name, size}} /></Link> : <IconSvg config={{name, size}} />} */}
        {className === "btn-import" && <input type="file" accept={accept.join(",")} onChange={callback} />}
    </div>
}

const Expansion = () => {
    const [isPlay, setIsPlay] = useState<boolean>(false);
    const musicOption = [{className: "btn-music", callback: () => handleOpenMusic()}];
    const expansionOption = [
        {className: "btn-import", callback: (e: any) => handleImport(e)},
        {className: "btn-export", callback: () => handleExport() },
        // {name: "icon-gift", href: '/gift'},
        // {name: "icon-prize", href: '/win-list'},
        // {name: "icon-setting", href: '/setting', isLast: true}
    ];

    const handleOpenMusic = () => {
        VoiceUtilHelper.switchAudio(0);
        setIsPlay(!isPlay);
    }

    const handleExport = async() => {
        await LotteryUtilHelper.exportExcel();
    }

    const handleImport = async(e: any) => {
        await LotteryUtilHelper.importExcel(e.target.files[0]);
        e.target.value = "";
    }

    return <div className="wl-expansion-wrapper">
        <div className="wl-expansion-inner">
            <div className="inner-top">
                {!isPlay && musicOption.map((it: any) => <Btn key={it.className} {...it} />)}
            </div>
            <div className="inner-bottom">
                {expansionOption.map((it: any) => <Btn key={it.className} {...it} />)}
            </div>
        </div>
    </div>  
};

export default Expansion;
