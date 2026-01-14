import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import type { ToolCall, ToolState } from '../../../tools/types.js';

interface ToolStatusProps {
  toolCall: ToolCall;
  status: ToolState;
}

const statusIcons: Record<ToolState, string> = {
  pending: '○',
  running: '',
  success: '✓',
  error: '✗'
};

const statusColors: Record<ToolState, string> = {
  pending: 'gray',
  running: 'yellow',
  success: 'green',
  error: 'red'
};

export const ToolStatus: React.FC<ToolStatusProps> = ({ toolCall, status }) => {
  const inputStr = JSON.stringify(toolCall.input);
  const truncatedInput = inputStr.length > 50 ? inputStr.slice(0, 47) + '...' : inputStr;

  return (
    <Box>
      <Text color={statusColors[status]}>
        {status === 'running' ? (
          <Spinner type="dots" />
        ) : (
          statusIcons[status]
        )}
      </Text>
      <Text> </Text>
      <Text color="blue" bold>{toolCall.name}</Text>
      <Text color="gray" dimColor> {truncatedInput}</Text>
    </Box>
  );
};
