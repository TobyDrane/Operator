import React from 'react';
import { Box, Text } from 'ink';

interface AgentOutputProps {
  text: string;
}

export const AgentOutput: React.FC<AgentOutputProps> = ({ text }) => {
  if (!text) {
    return null;
  }

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text>{text}</Text>
    </Box>
  );
};
