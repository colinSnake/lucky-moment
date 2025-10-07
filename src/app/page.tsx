
import { Alert, BtnGroup, Core, Expansion, PrizeCards, WinnerBg } from "@/components";

const Home = () => {
    return (
        <div className="main-wrapper">
            <Alert />
            <div className="main-inner main-inner-absolute">
                <div className="main-content">
                    <PrizeCards />
                    <Core />
                    <BtnGroup />
                </div>
            </div>
            <div className="main-inner">
                <canvas id="starry-sky"></canvas>
            </div>
            <Expansion />
            <WinnerBg />
        </div>
    )
}

export default Home;