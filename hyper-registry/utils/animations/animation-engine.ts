import { z } from 'zod';

// Animation Engine for Universal Hyper Registry
export const EasingFunctionSchema = z.enum([
  'linear', 'ease-in', 'ease-out', 'ease-in-out',
  'bounce', 'elastic', 'cubic-bezier'
]);

export type EasingFunction = z.infer<typeof EasingFunctionSchema>;

export const AnimationKeyframeSchema = z.object({
  time: z.number(), // 0-1
  properties: z.record(z.any()),
  easing: EasingFunctionSchema.optional()
});

export type AnimationKeyframe = z.infer<typeof AnimationKeyframeSchema>;

export const AnimationConfigSchema = z.object({
  duration: z.number(), // milliseconds
  delay: z.number().default(0),
  easing: EasingFunctionSchema.default('ease-out'),
  repeat: z.number().default(0), // -1 for infinite
  direction: z.enum(['normal', 'reverse', 'alternate', 'alternate-reverse']).default('normal'),
  keyframes: z.array(AnimationKeyframeSchema).optional()
});

export type AnimationConfig = z.infer<typeof AnimationConfigSchema>;

export class Easing {
  static linear(t: number): number {
    return t;
  }

  static easeIn(t: number): number {
    return t * t;
  }

  static easeOut(t: number): number {
    return t * (2 - t);
  }

  static easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  static bounce(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }

  static elastic(t: number): number {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  }

  static cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number): (t: number) => number {
    return (t: number) => {
      // Simplified cubic bezier implementation
      const cx = 3 * p1x;
      const bx = 3 * (p2x - p1x) - cx;
      const ax = 1 - cx - bx;

      const cy = 3 * p1y;
      const by = 3 * (p2y - p1y) - cy;
      const ay = 1 - cy - by;

      return ay * t * t * t + by * t * t + cy * t;
    };
  }

  static getFunction(name: EasingFunction): (t: number) => number {
    switch (name) {
      case 'linear': return this.linear;
      case 'ease-in': return this.easeIn;
      case 'ease-out': return this.easeOut;
      case 'ease-in-out': return this.easeInOut;
      case 'bounce': return this.bounce;
      case 'elastic': return this.elastic;
      case 'cubic-bezier': return this.cubicBezier(0.25, 0.1, 0.25, 1); // Default ease
      default: return this.linear;
    }
  }
}

export class KeyframeAnimation {
  private keyframes: AnimationKeyframe[];
  private duration: number;
  private easing: EasingFunction;

  constructor(config: AnimationConfig) {
    this.keyframes = config.keyframes || [];
    this.duration = config.duration;
    this.easing = config.easing;

    // Ensure keyframes are sorted by time
    this.keyframes.sort((a, b) => a.time - b.time);
  }

  interpolate(time: number): Record<string, any> {
    if (this.keyframes.length === 0) return {};

    // Normalize time to 0-1
    const normalizedTime = Math.max(0, Math.min(1, time / this.duration));

    // Find keyframes to interpolate between
    let startKeyframe = this.keyframes[0];
    let endKeyframe = this.keyframes[this.keyframes.length - 1];

    for (let i = 0; i < this.keyframes.length - 1; i++) {
      if (normalizedTime >= this.keyframes[i].time && normalizedTime <= this.keyframes[i + 1].time) {
        startKeyframe = this.keyframes[i];
        endKeyframe = this.keyframes[i + 1];
        break;
      }
    }

    const easingFn = Easing.getFunction(startKeyframe.easing || this.easing);
    const easedTime = easingFn(normalizedTime);

    // Interpolate between keyframes
    return this.interpolateProperties(startKeyframe.properties, endKeyframe.properties, easedTime);
  }

  private interpolateProperties(start: Record<string, any>, end: Record<string, any>, t: number): Record<string, any> {
    const result: Record<string, any> = {};

    const allKeys = new Set([...Object.keys(start), ...Object.keys(end)]);

    for (const key of allKeys) {
      const startValue = start[key];
      const endValue = end[key];

      if (startValue === undefined) {
        result[key] = endValue;
      } else if (endValue === undefined) {
        result[key] = startValue;
      } else if (typeof startValue === 'number' && typeof endValue === 'number') {
        result[key] = startValue + (endValue - startValue) * t;
      } else if (Array.isArray(startValue) && Array.isArray(endValue) && startValue.length === endValue.length) {
        result[key] = startValue.map((val, index) =>
          typeof val === 'number' && typeof endValue[index] === 'number' ?
            val + (endValue[index] - val) * t : val
        );
      } else {
        // Non-interpolatable values - use start value until halfway, then end value
        result[key] = t < 0.5 ? startValue : endValue;
      }
    }

    return result;
  }
}

export class Animation {
  private config: AnimationConfig;
  private startTime: number = 0;
  private isPlaying: boolean = false;
  private currentIteration: number = 0;
  private direction: number = 1; // 1 for forward, -1 for reverse
  private keyframeAnimation?: KeyframeAnimation;

  constructor(config: AnimationConfig) {
    this.config = config;
    if (config.keyframes && config.keyframes.length > 0) {
      this.keyframeAnimation = new KeyframeAnimation(config);
    }
  }

  play(): void {
    this.startTime = Date.now();
    this.isPlaying = true;
    this.currentIteration = 0;
    this.direction = this.config.direction === 'reverse' ? -1 : 1;
  }

  pause(): void {
    this.isPlaying = false;
  }

  stop(): void {
    this.isPlaying = false;
    this.currentIteration = 0;
  }

  update(): Record<string, any> | null {
    if (!this.isPlaying) return null;

    const currentTime = Date.now();
    const elapsed = currentTime - this.startTime;

    // Handle delay
    if (elapsed < this.config.delay) return {};

    const animationTime = elapsed - this.config.delay;
    const duration = this.config.duration;

    // Calculate current progress
    let progress = animationTime / duration;

    // Handle repetition
    if (this.config.repeat !== 0) {
      const totalIterations = this.config.repeat === -1 ? Infinity : this.config.repeat + 1;

      if (progress >= 1) {
        this.currentIteration++;

        if (this.currentIteration >= totalIterations) {
          this.stop();
          return null; // Animation finished
        }

        // Reset for next iteration
        this.startTime = currentTime;
        progress = 0;

        // Handle direction changes
        if (this.config.direction === 'alternate' || this.config.direction === 'alternate-reverse') {
          this.direction *= -1;
        }
      }
    } else if (progress >= 1) {
      this.stop();
      return null; // Animation finished
    }

    // Apply direction
    if (this.direction === -1) {
      progress = 1 - progress;
    }

    // Get interpolated values
    if (this.keyframeAnimation) {
      return this.keyframeAnimation.interpolate(progress * duration);
    }

    // Simple easing for non-keyframe animations
    const easingFn = Easing.getFunction(this.config.easing);
    const easedProgress = easingFn(progress);

    return { progress: easedProgress };
  }

  isActive(): boolean {
    return this.isPlaying;
  }

  getProgress(): number {
    if (!this.isPlaying) return 0;

    const elapsed = Date.now() - this.startTime - this.config.delay;
    return Math.min(1, elapsed / this.config.duration);
  }
}

export class Particle {
  public position: [number, number, number] = [0, 0, 0];
  public velocity: [number, number, number] = [0, 0, 0];
  public acceleration: [number, number, number] = [0, 0, 0];
  public life: number = 1.0; // 0 to 1
  public maxLife: number = 1.0;
  public size: number = 1.0;
  public color: [number, number, number, number] = [1, 1, 1, 1]; // RGBA
  public rotation: number = 0;
  public rotationSpeed: number = 0;

  constructor() {
    // Initialize with default values
  }

  update(deltaTime: number): void {
    // Update velocity with acceleration
    this.velocity[0] += this.acceleration[0] * deltaTime;
    this.velocity[1] += this.acceleration[1] * deltaTime;
    this.velocity[2] += this.acceleration[2] * deltaTime;

    // Update position with velocity
    this.position[0] += this.velocity[0] * deltaTime;
    this.position[1] += this.velocity[1] * deltaTime;
    this.position[2] += this.velocity[2] * deltaTime;

    // Update rotation
    this.rotation += this.rotationSpeed * deltaTime;

    // Update life
    this.life = Math.max(0, this.life - deltaTime / this.maxLife);
  }

  isAlive(): boolean {
    return this.life > 0;
  }

  reset(): void {
    this.position = [0, 0, 0];
    this.velocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.life = this.maxLife;
    this.size = 1.0;
    this.color = [1, 1, 1, 1];
    this.rotation = 0;
    this.rotationSpeed = 0;
  }
}

export class ParticleEmitter {
  private particles: Particle[] = [];
  private maxParticles: number;
  private emissionRate: number; // particles per second
  private lastEmission: number = 0;
  private particleLife: number;
  private position: [number, number, number];
  private velocityRange: [[number, number], [number, number], [number, number]];
  private sizeRange: [number, number];
  private colorRange: [[number, number], [number, number], [number, number], [number, number]];

  constructor(config: {
    maxParticles: number;
    emissionRate: number;
    particleLife: number;
    position: [number, number, number];
    velocityRange?: [[number, number], [number, number], [number, number]];
    sizeRange?: [number, number];
    colorRange?: [[number, number], [number, number], [number, number], [number, number]];
  }) {
    this.maxParticles = config.maxParticles;
    this.emissionRate = config.emissionRate;
    this.particleLife = config.particleLife;
    this.position = config.position;
    this.velocityRange = config.velocityRange || [[-1, 1], [-1, 1], [-1, 1]];
    this.sizeRange = config.sizeRange || [0.5, 2.0];
    this.colorRange = config.colorRange || [[0.5, 1], [0.5, 1], [0.5, 1], [0.5, 1]];

    // Initialize particle pool
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(new Particle());
    }
  }

  update(deltaTime: number): void {
    // Update existing particles
    this.particles.forEach(particle => {
      if (particle.isAlive()) {
        particle.update(deltaTime);
      }
    });

    // Emit new particles
    this.lastEmission += deltaTime;
    const particlesToEmit = Math.floor(this.lastEmission * this.emissionRate);

    for (let i = 0; i < particlesToEmit && this.lastEmission >= 1 / this.emissionRate; i++) {
      this.emitParticle();
      this.lastEmission -= 1 / this.emissionRate;
    }
  }

  private emitParticle(): void {
    // Find dead particle to reuse
    const deadParticle = this.particles.find(p => !p.isAlive());
    if (!deadParticle) return;

    // Reset and configure particle
    deadParticle.reset();
    deadParticle.maxLife = this.particleLife;
    deadParticle.life = this.particleLife;

    // Set position
    deadParticle.position = [...this.position];

    // Random velocity within range
    deadParticle.velocity = [
      this.randomInRange(this.velocityRange[0][0], this.velocityRange[0][1]),
      this.randomInRange(this.velocityRange[1][0], this.velocityRange[1][1]),
      this.randomInRange(this.velocityRange[2][0], this.velocityRange[2][1])
    ];

    // Random size
    deadParticle.size = this.randomInRange(this.sizeRange[0], this.sizeRange[1]);

    // Random color
    deadParticle.color = [
      this.randomInRange(this.colorRange[0][0], this.colorRange[0][1]),
      this.randomInRange(this.colorRange[1][0], this.colorRange[1][1]),
      this.randomInRange(this.colorRange[2][0], this.colorRange[2][1]),
      this.randomInRange(this.colorRange[3][0], this.colorRange[3][1])
    ];
  }

  private randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  getParticles(): Particle[] {
    return this.particles.filter(p => p.isAlive());
  }

  setPosition(position: [number, number, number]): void {
    this.position = position;
  }

  setEmissionRate(rate: number): void {
    this.emissionRate = rate;
  }
}

export class ParticleSystem {
  private emitters: ParticleEmitter[] = [];

  addEmitter(emitter: ParticleEmitter): void {
    this.emitters.push(emitter);
  }

  removeEmitter(emitter: ParticleEmitter): void {
    const index = this.emitters.indexOf(emitter);
    if (index > -1) {
      this.emitters.splice(index, 1);
    }
  }

  update(deltaTime: number): void {
    this.emitters.forEach(emitter => emitter.update(deltaTime));
  }

  getAllParticles(): Particle[] {
    return this.emitters.flatMap(emitter => emitter.getParticles());
  }

  clear(): void {
    this.emitters = [];
  }
}

export class AnimationEngine {
  private animations: Map<string, Animation> = new Map();
  private particleSystem: ParticleSystem = new ParticleSystem();
  private lastUpdate: number = Date.now();

  animate(
    id: string,
    config: AnimationConfig,
    onUpdate?: (values: Record<string, any>) => void,
    onComplete?: () => void
  ): void {
    const animation = new Animation(config);
    this.animations.set(id, animation);

    const updateLoop = () => {
      const values = animation.update();
      if (values !== null) {
        onUpdate?.(values);
        setTimeout(updateLoop, 16); // ~60fps
      } else {
        this.animations.delete(id);
        onComplete?.();
      }
    };

    animation.play();
    updateLoop();
  }

  stopAnimation(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.stop();
      this.animations.delete(id);
    }
  }

  pauseAnimation(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.pause();
    }
  }

  resumeAnimation(id: string): void {
    const animation = this.animations.get(id);
    if (animation) {
      animation.play();
    }
  }

  getParticleSystem(): ParticleSystem {
    return this.particleSystem;
  }

  update(): void {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdate) / 1000; // Convert to seconds
    this.lastUpdate = now;

    this.particleSystem.update(deltaTime);
  }

  // Preset animations
  static fadeIn(duration: number = 300): AnimationConfig {
    return {
      duration,
      delay: 0,
      easing: 'ease-out',
      repeat: 0,
      direction: 'normal',
      keyframes: [
        { time: 0, properties: { opacity: 0 } },
        { time: 1, properties: { opacity: 1 } }
      ]
    };
  }

  static fadeOut(duration: number = 300): AnimationConfig {
    return {
      duration,
      delay: 0,
      easing: 'ease-out',
      repeat: 0,
      direction: 'normal',
      keyframes: [
        { time: 0, properties: { opacity: 1 } },
        { time: 1, properties: { opacity: 0 } }
      ]
    };
  }

  static slideInFromLeft(duration: number = 300): AnimationConfig {
    return {
      duration,
      delay: 0,
      easing: 'ease-out',
      repeat: 0,
      direction: 'normal',
      keyframes: [
        { time: 0, properties: { x: -100, opacity: 0 } },
        { time: 1, properties: { x: 0, opacity: 1 } }
      ]
    };
  }

  static slideInFromRight(duration: number = 300): AnimationConfig {
    return {
      duration,
      delay: 0,
      easing: 'ease-out',
      repeat: 0,
      direction: 'normal',
      keyframes: [
        { time: 0, properties: { x: 100, opacity: 0 } },
        { time: 1, properties: { x: 0, opacity: 1 } }
      ]
    };
  }

  static bounceIn(duration: number = 600): AnimationConfig {
    return {
      duration,
      delay: 0,
      easing: 'bounce',
      repeat: 0,
      direction: 'normal',
      keyframes: [
        { time: 0, properties: { scale: 0.3, opacity: 0 } },
        { time: 0.5, properties: { scale: 1.05, opacity: 1 } },
        { time: 0.7, properties: { scale: 0.9 } },
        { time: 1, properties: { scale: 1 } }
      ]
    };
  }

  static pulse(duration: number = 1000, repeat: number = -1): AnimationConfig {
    return {
      duration,
      delay: 0,
      repeat,
      direction: 'alternate',
      easing: 'ease-in-out',
      keyframes: [
        { time: 0, properties: { scale: 1 } },
        { time: 1, properties: { scale: 1.1 } }
      ]
    };
  }

  static shake(duration: number = 500): AnimationConfig {
    return {
      duration,
      delay: 0,
      easing: 'ease-in-out',
      repeat: 0,
      direction: 'normal',
      keyframes: [
        { time: 0, properties: { x: 0 } },
        { time: 0.1, properties: { x: -10 } },
        { time: 0.2, properties: { x: 10 } },
        { time: 0.3, properties: { x: -10 } },
        { time: 0.4, properties: { x: 10 } },
        { time: 0.5, properties: { x: -10 } },
        { time: 0.6, properties: { x: 10 } },
        { time: 0.7, properties: { x: -10 } },
        { time: 0.8, properties: { x: 10 } },
        { time: 0.9, properties: { x: -10 } },
        { time: 1, properties: { x: 0 } }
      ]
    };
  }
}