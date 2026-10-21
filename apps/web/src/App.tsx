import {
  Alert,
  BtnGroup,
  Core,
  Expansion,
  FontBg,
  GiftCards,
  WinnerBg,
} from "@/components";
import { lazy, Suspense, useEffect, useState } from "react";

const ParticlesContainer = lazy(() => import("@/components/particles"));

export default function App() {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const requestIdle = window.requestIdleCallback ?? ((callback: IdleRequestCallback) =>
      window.setTimeout(() => callback({ didTimeout: true, timeRemaining: () => 0 } as IdleDeadline), 1200));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const idleId = requestIdle(() => setShowParticles(true), { timeout: 2000 });
    return () => cancelIdle(idleId);
  }, []);

  return (
    <div className="wl-wrapper">
      <div className="wl-inner wl-inner-background" />
      <div className="wl-inner wl-inner-particle">
        {showParticles && (
          <Suspense fallback={null}>
            <ParticlesContainer />
          </Suspense>
        )}
      </div>
      <div className="wl-inner wl-inner-content">
        <div className="wl-box">
          <Alert />
          <GiftCards />
          <Core />
          <BtnGroup />
          <FontBg />
          <WinnerBg />
          <Expansion />
        </div>
      </div>
    </div>
  );
}
