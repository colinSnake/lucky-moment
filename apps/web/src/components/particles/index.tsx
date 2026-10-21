import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { starfieldOptions } from "@/module/mockData/particles";
import "./index.css";

const ParticlesContainer = () => {
    const particlesInit = useCallback(async (engine: any) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={starfieldOptions}
        />
    );
};

export default ParticlesContainer;
