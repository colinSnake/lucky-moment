
import { Alert, BtnGroup, Core, Expansion, FontBg, GiftCards, WinnerBg } from "@/components";

const Home = () => {
    const renderContent = () => {
        return <div className="wl-box">
            <GiftCards />
            <Core />
            <BtnGroup />
        </div>;
    }

    return (
        <div className="wl-wrapper">
            <Alert />
            <div className="wl-inner wl-inner-background"></div>
            <div className="wl-inner wl-inner-sparticle"></div>
            <div className="wl-inner wl-inner-content">{renderContent()}</div>
            {/* <div className="wl-inner wl-inner-starry">
                <canvas id="starry-sky"></canvas>
            </div> */}
            <FontBg />  
            <WinnerBg />
            <Expansion />
        </div>
    )
}

export default Home;