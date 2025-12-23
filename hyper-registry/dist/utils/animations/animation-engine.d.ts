import { z } from 'zod';
export declare const EasingFunctionSchema: z.ZodEnum<["linear", "ease-in", "ease-out", "ease-in-out", "bounce", "elastic", "cubic-bezier"]>;
export type EasingFunction = z.infer<typeof EasingFunctionSchema>;
export declare const AnimationKeyframeSchema: z.ZodObject<{
    time: z.ZodNumber;
    properties: z.ZodRecord<z.ZodString, z.ZodAny>;
    easing: z.ZodOptional<z.ZodEnum<["linear", "ease-in", "ease-out", "ease-in-out", "bounce", "elastic", "cubic-bezier"]>>;
}, "strip", z.ZodTypeAny, {
    time: number;
    properties: Record<string, any>;
    easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | "elastic" | "cubic-bezier" | undefined;
}, {
    time: number;
    properties: Record<string, any>;
    easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | "elastic" | "cubic-bezier" | undefined;
}>;
export type AnimationKeyframe = z.infer<typeof AnimationKeyframeSchema>;
export declare const AnimationConfigSchema: z.ZodObject<{
    duration: z.ZodNumber;
    delay: z.ZodDefault<z.ZodNumber>;
    easing: z.ZodDefault<z.ZodEnum<["linear", "ease-in", "ease-out", "ease-in-out", "bounce", "elastic", "cubic-bezier"]>>;
    repeat: z.ZodDefault<z.ZodNumber>;
    direction: z.ZodDefault<z.ZodEnum<["normal", "reverse", "alternate", "alternate-reverse"]>>;
    keyframes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        time: z.ZodNumber;
        properties: z.ZodRecord<z.ZodString, z.ZodAny>;
        easing: z.ZodOptional<z.ZodEnum<["linear", "ease-in", "ease-out", "ease-in-out", "bounce", "elastic", "cubic-bezier"]>>;
    }, "strip", z.ZodTypeAny, {
        time: number;
        properties: Record<string, any>;
        easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | "elastic" | "cubic-bezier" | undefined;
    }, {
        time: number;
        properties: Record<string, any>;
        easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | "elastic" | "cubic-bezier" | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    repeat: number;
    easing: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | "elastic" | "cubic-bezier";
    duration: number;
    delay: number;
    direction: "reverse" | "normal" | "alternate" | "alternate-reverse";
    keyframes?: {
        time: number;
        properties: Record<string, any>;
        easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | "elastic" | "cubic-bezier" | undefined;
    }[] | undefined;
}, {
    duration: number;
    repeat?: number | undefined;
    easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | "elastic" | "cubic-bezier" | undefined;
    delay?: number | undefined;
    direction?: "reverse" | "normal" | "alternate" | "alternate-reverse" | undefined;
    keyframes?: {
        time: number;
        properties: Record<string, any>;
        easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | "elastic" | "cubic-bezier" | undefined;
    }[] | undefined;
}>;
export type AnimationConfig = z.infer<typeof AnimationConfigSchema>;
export declare class Easing {
    static linear(t: number): number;
    static easeIn(t: number): number;
    static easeOut(t: number): number;
    static easeInOut(t: number): number;
    static bounce(t: number): number;
    static elastic(t: number): number;
    static cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number): (t: number) => number;
    static getFunction(name: EasingFunction): (t: number) => number;
}
export declare class KeyframeAnimation {
    private keyframes;
    private duration;
    private easing;
    constructor(config: AnimationConfig);
    interpolate(time: number): Record<string, any>;
    private interpolateProperties;
}
export declare class Animation {
    private config;
    private startTime;
    private isPlaying;
    private currentIteration;
    private direction;
    private keyframeAnimation?;
    constructor(config: AnimationConfig);
    play(): void;
    pause(): void;
    stop(): void;
    update(): Record<string, any> | null;
    isActive(): boolean;
    getProgress(): number;
}
export declare class Particle {
    position: [number, number, number];
    velocity: [number, number, number];
    acceleration: [number, number, number];
    life: number;
    maxLife: number;
    size: number;
    color: [number, number, number, number];
    rotation: number;
    rotationSpeed: number;
    constructor();
    update(deltaTime: number): void;
    isAlive(): boolean;
    reset(): void;
}
export declare class ParticleEmitter {
    private particles;
    private maxParticles;
    private emissionRate;
    private lastEmission;
    private particleLife;
    private position;
    private velocityRange;
    private sizeRange;
    private colorRange;
    constructor(config: {
        maxParticles: number;
        emissionRate: number;
        particleLife: number;
        position: [number, number, number];
        velocityRange?: [[number, number], [number, number], [number, number]];
        sizeRange?: [number, number];
        colorRange?: [[number, number], [number, number], [number, number], [number, number]];
    });
    update(deltaTime: number): void;
    private emitParticle;
    private randomInRange;
    getParticles(): Particle[];
    setPosition(position: [number, number, number]): void;
    setEmissionRate(rate: number): void;
}
export declare class ParticleSystem {
    private emitters;
    addEmitter(emitter: ParticleEmitter): void;
    removeEmitter(emitter: ParticleEmitter): void;
    update(deltaTime: number): void;
    getAllParticles(): Particle[];
    clear(): void;
}
export declare class AnimationEngine {
    private animations;
    private particleSystem;
    private lastUpdate;
    animate(id: string, config: AnimationConfig, onUpdate?: (values: Record<string, any>) => void, onComplete?: () => void): void;
    stopAnimation(id: string): void;
    pauseAnimation(id: string): void;
    resumeAnimation(id: string): void;
    getParticleSystem(): ParticleSystem;
    update(): void;
    static fadeIn(duration?: number): AnimationConfig;
    static fadeOut(duration?: number): AnimationConfig;
    static slideInFromLeft(duration?: number): AnimationConfig;
    static slideInFromRight(duration?: number): AnimationConfig;
    static bounceIn(duration?: number): AnimationConfig;
    static pulse(duration?: number, repeat?: number): AnimationConfig;
    static shake(duration?: number): AnimationConfig;
}
//# sourceMappingURL=animation-engine.d.ts.map