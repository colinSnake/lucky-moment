
import { Alert, BtnGroup, Core, PrizeCards } from "@/components";

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
        </div>
    )
}

export default Home;