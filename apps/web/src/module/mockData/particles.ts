import { colors } from "./";

export const bubbleOptions: any = {
    background: { color: "transparent" },
    particles: {
        number: { value: 72 },
        color: { value: colors },
        shape: { type: "circle" },
        opacity: {
            value: { min: 0.1, max: 0.5 }
        },
        size: {
            value: { min: 20, max: 60 }
        },
        move: {
            enable: true,
            speed: 1,
            direction: "top", // 向上移动
            random: true,
            straight: false,
            outModes: {
                default: "destroy",
                top: "destroy" // 到达顶部时销毁
            }
        }
    },
    emitters: [
        {
            direction: "none",
            life: { count: 0}, // 无限循环
            rate: { delay: 0.5, quantity: 2 },
            size: { width: 100, height: 100 },
            position: { x: 50, y: 0 }, // 从底部发射
            spawnColor: {
                value: colors
            }
        },
        {
            direction: "none",
            life: { count: 0, duration: 0.5, delay: 0}, // 无限循环
            rate: { delay: 0.5, quantity: 2 },
            size: { width: 100, height: 100 },
            position: { x: 50, y: 0 }, // 从底部发射
            spawnColor: {
                value: colors
            }
        }
    ]
};

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
