import { colors } from "./";

export const starfieldOptions: any = {
    background: { color: "transparent" },
    fpsLimit: 30,
    detectRetina: false,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    particles: {
        number: { value: 90 },
        color: { value: colors },
        shape: { type: "star" },
        opacity: {
            value: { min: 0.1, max: 0.5 },
            animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false
            }
        },
        size: {
            value: { min: 1, max: 5 }
        },
        move: {
            enable: true,
            speed: 0.5,
            direction: "none",
            random: true,
            outModes: {
                default: "destroy"
            }
        },
        twinkle: {
            lines: {
                enable: true,
                frequency: 0.05,
                opacity: 0.5
            }
        }
    }
};
