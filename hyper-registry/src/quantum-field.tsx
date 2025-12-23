import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import gradient from "gradient-string";
import chalk from "chalk";

// Strict particle type definition
type ParticleType = "registry" | "service" | "plugin" | "config" | "security" | "mesh";
interface Particle {
  x: number;
  y: number;
  type: ParticleType;
  entangled: boolean;
}

interface QuantumFieldProps {
  particleCount: number;
  entangledPairs: number;
  decoherence: number;
  theme: "quantum-nexus" | "neural-matrix" | "holographic-command" | "bioluminescent-ocean";
}

const particleTypes: Record<ParticleType, string> = {
  registry: "●",
  service: "○",
  plugin: "⬤",
  config: "◇",
  security: "☆",
  mesh: "⬟"
};
const typeColor: Record<ParticleType, string> = {
  registry: "#00f3ff",
  service: "#ff00ff",
  plugin: "#00ff9d",
  config: "#ffd166",
  security: "#ff3366",
  mesh: "#8a2be2"
};

export const QuantumFieldVisualizer: React.FC<QuantumFieldProps> = ({
  particleCount,
  entangledPairs,
  decoherence,
  theme
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const genParticles = (): Particle[] => {
      const types: ParticleType[] = Object.keys(particleTypes) as ParticleType[];
      return Array.from({ length: particleCount }, (_, i) => ({
        x: Math.round(40 + 20 * Math.sin(i + tick / 10)),
        y: Math.round(10 + 6 * Math.cos(i / 8 + tick / 30)),
        type: types[i % types.length],
        entangled: i < entangledPairs
      }));
    };
    setParticles(genParticles());

    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 100); // "quantum" animation tick
    return () => clearInterval(interval);
  }, [particleCount, entangledPairs, tick]);

  // Colorful quantum field line
  const quantumLine = (line: string) =>
    gradient(theme === "quantum-nexus" ? ["#00f3ff", "#ff00ff"] : ["#00ff9d", "#ffd166"]).multiline(line);

  return (
    <Box flexDirection="column" marginY={1}>
      <Box>
        <Text bold color="cyan">
          🌌 QUANTUM FIELD VISUALIZER
        </Text>
        <Text> │ PARTICLES: {particleCount.toLocaleString()} │ ENTANGLED: {entangledPairs.toLocaleString()} │ DECOHERENCE: {decoherence}%</Text>
      </Box>
      <Box flexDirection="column" marginY={1}>
        {Array.from({ length: 20 }).map((_, row) => (
          <Text key={row}>
            {particles
              .filter((p) => p.y === row)
              .map((p, i) =>
                chalk.hex(typeColor[p.type])(
                  p.entangled ? chalk.bold(particleTypes[p.type]) : particleTypes[p.type]
                )
              )
              .join(" ")}
          </Text>
        ))}
      </Box>
      <Box>
        <Text>
          PARTICLE TYPES: ● Registry Nodes ○ Services ⬤ Plugins ◇ Configurations ☆ Security ⬟ Mesh Nodes
        </Text>
      </Box>
      <Box marginY={1}>
        <Text>
          QUANTUM CONTROLS: [🌀] ENTANGLE │ [⚡] SUPERPOSE │ [🌊] INTERFERE │ [🔬] COLLAPSE │ [♾️] DECOHERE │ [🔄] ENTROPY │ [🎯] OBSERVE
        </Text>
      </Box>
      <Box>
        <Text>
          QUANTUM METRICS: Entanglement Density: 0.87 │ Superposition States: 142 │ Wave Function Collapse: 24
        </Text>
      </Box>
    </Box>
  );
};