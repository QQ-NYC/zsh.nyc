import React from "react";
import { Box, Text } from "ink";
import { QuantumFieldVisualizer } from "./quantum-field";
import { NeuralCommandPanel } from "./neural-command-panel";

export const Dashboard: React.FC = () => (
  <Box flexDirection="column" paddingX={2} paddingY={1}>
    <Box flexDirection="row" justifyContent="center">
      <Text bold color="cyan">⚡ COMMAND DECK v1.0 | HYPER REGISTRY UNIVERSE CONTROL CENTER</Text>
    </Box>
    <Box flexDirection="row" marginY={1}>
      <Box flexGrow={1} flexDirection="column">
        <QuantumFieldVisualizer particleCount={142857} entangledPairs={12459} decoherence={0.042} theme="quantum-nexus" />
      </Box>
      <Box flexGrow={1} marginX={2}>
        <NeuralCommandPanel />
      </Box>
    </Box>
    <Box flexDirection="row" marginY={2}>
      <Text>
        [1] Registry Map | [2] Quantum Telemetry | [3] Neural Matrix | [4] Fusion Scoring | [TAB] Switch | [ESC] Exit
      </Text>
    </Box>
  </Box>
);