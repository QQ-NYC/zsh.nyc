import React from "react";
import { Box, Text } from "ink";

export const NeuralCommandPanel: React.FC = () => (
  <Box flexDirection="row" borderStyle="round" borderColor="magenta" marginY={1}>
    <Box flexDirection="column" paddingX={2}>
      <Text bold color="green">🎤 NEURAL COMMAND INTERFACE │ VOICE ACTIVATED │ GESTURE ENABLED</Text>
      <Text>
        [VOICE COMMANDS] Natural language │ Context-aware │ Multi-language │ Voice profiles
      </Text>
    </Box>
    <Box flexDirection="column" paddingX={2}>
      <Text bold color="cyan">Active Command Processing</Text>
      <Text>🎤 LISTENING... │ Parsing intent, context, parameters │ [EXECUTING...]</Text>
    </Box>
    <Box flexDirection="column" paddingX={2}>
      <Text bold color="yellow">Gesture Recognition</Text>
      <Text>👉/👈/👆/👇/✊/🤚/🤙/👌/👍/👎/✌️/🤟 supported</Text>
    </Box>
  </Box>
);