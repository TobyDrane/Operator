import React from 'react';
import { Box, Text } from 'ink';
import type { AgentError } from '../../../types.js';

interface ErrorDisplayProps {
  error: AgentError;
}

const errorLabels: Record<AgentError['code'], string> = {
  tool_error: 'Tool Error',
  api_error: 'API Error',
  validation_error: 'Validation Error',
  unknown: 'Error'
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="red" paddingX={1}>
      <Text color="red" bold>
        {errorLabels[error.code]}
      </Text>
      <Text color="red">{error.message}</Text>
    </Box>
  );
};
