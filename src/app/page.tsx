
import { Alert, BtnGroup, Core, Expansion, FontBg, GiftCards, WinnerBg } from "@/components";

const Home = () => {
    return (
        <div className="main-wrapper">
            <Alert />
            <div className="main-inner main-inner-absolute">
                <div className="main-content">
                    <GiftCards />
                    <Core />
                    <BtnGroup />
                </div>
            </div>
            <div className="main-inner">
                <canvas id="starry-sky"></canvas>
            </div>
            <FontBg />  
            <WinnerBg />
            <Expansion />
        </div>
    )
}

export default Home;