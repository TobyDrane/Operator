import React, { useState } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import type { ToolCall, ToolState } from '../../../tools/types.js';

interface ToolStatusProps {
  toolCall: ToolCall;
  status: ToolState;
  result?: string;
  error?: string;
}

const statusColors: Record<ToolState, string> = {
  pending: 'gray',
  running: 'yellow',
  success: 'green',
  error: 'red'
};

export const ToolStatus: React.FC<ToolStatusProps> = ({ toolCall, status, result, error }) => {
  const [expanded, setExpanded] = useState(false);

  const inputStr = JSON.stringify(toolCall.input, null, 2);
  const hasOutput = result || error;

  return (
    <Box flexDirection="column">
      <Box>
        <Text color={statusColors[status]}>
          {status === 'running' ? (
            <Spinner type="dots" />
          ) : status === 'success' ? (
            '✓'
          ) : status === 'error' ? (
            '✗'
          ) : (
            '○'
          )}
        </Text>
        <Text> </Text>
        <Text color="blue" bold>{toolCall.name}</Text>
        {hasOutput && (
          <Text color="gray" dimColor> [{expanded ? '▼' : '▶'}]</Text>
        )}
      </Box>

      {/* Show input args */}
      <Box marginLeft={2}>
        <Text color="gray" dimColor>
          {inputStr.length > 100 ? inputStr.slice(0, 100) + '...' : inputStr}
        </Text>
      </Box>

      {/* Show result/error when completed */}
      {hasOutput && (
        <Box marginLeft={2} marginTop={1} flexDirection="column">
          {error ? (
            <Text color="red">{error}</Text>
          ) : result ? (
            <Text color="gray">
              {result.length > 200 ? result.slice(0, 200) + '...' : result}
            </Text>
          ) : null}
        </Box>
      )}
    </Box>
  );
};
