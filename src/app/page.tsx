
import { Alert, BtnGroup, Core, Expansion, FontBg, GiftCards, WinnerBg } from "@/components";

const Home = () => {
    const renderContent = () => {
        return <div className="wl-box">
            <Alert />
            <GiftCards />
            <Core />
            <BtnGroup />
            <FontBg />  
            <WinnerBg />
            <Expansion />
        </div>;
    }

    return (
        <div className="wl-wrapper">
            <div className="wl-inner wl-inner-background"></div>
            <div className="wl-inner wl-inner-sparticle"></div>
            <div className="wl-inner wl-inner-content">{renderContent()}</div>
            {/* <div className="wl-inner wl-inner-starry">
                <canvas id="starry-sky"></canvas>
            </div> */}
        </div>
    )
}

export default Home;