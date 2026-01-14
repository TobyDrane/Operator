import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

interface ThinkingIndicatorProps {
  text?: string;
  isThinking: boolean;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ text, isThinking }) => {
  if (!isThinking) {
    return null;
  }

  return (
    <Box>
      <Text color="magenta">
        <Spinner type="dots" />
      </Text>
      <Text color="magenta" dimColor> Thinking</Text>
      {text && (
        <Text color="gray" dimColor>: {text.slice(0, 50)}{text.length > 50 ? '...' : ''}</Text>
      )}
    </Box>
  );
};
