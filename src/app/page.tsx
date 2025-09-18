
import { Btns, Core, PrizeCards } from "@/components";

const Home = () => {
    return (
        <div className="main-wrapper">
            <div className="main-inner main-inner-absolute">
                <div className="main-content">
                    <PrizeCards />
                    <Core />
                    <Btns />
                </div>
            </div>
            <div className="main-inner">
                <canvas id="starry-sky"></canvas>
            </div>
        </div>
    )
}

export default Home;