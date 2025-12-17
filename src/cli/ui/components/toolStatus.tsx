/**
 * @file toolStatus.tsx
 * @description Compact tool status display with timing
 */

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import type { ToolCall, ToolState } from '../../../types.js';

interface ToolStatusProps {
  toolCall: ToolCall;
  status: ToolState;
  result?: string;
  error?: string;
  duration?: number;
}

function formatArgs(input: Record<string, unknown>): string {
  const entries = Object.entries(input);
  if (entries.length === 0) return '';

  return entries.map(([key, value]) => {
    const strValue = typeof value === 'string'
      ? `"${value.length > 30 ? value.slice(0, 27) + '...' : value}"`
      : JSON.stringify(value);
    return `${key}: ${strValue.length > 40 ? strValue.slice(0, 37) + '...' : strValue}`;
  }).join(', ');
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function truncateResult(result: string, maxLines: number = 3): { text: string; truncated: boolean } {
  const lines = result.split('\n');
  if (lines.length <= maxLines) {
    return { text: result, truncated: false };
  }
  return {
    text: lines.slice(0, maxLines).join('\n'),
    truncated: true
  };
}

export const ToolStatus: React.FC<ToolStatusProps> = ({
  toolCall,
  status,
  result,
  error,
  duration
}) => {
  const [expanded, setExpanded] = useState(false);

  const statusIcon = status === 'running'
    ? <Spinner type="dots" />
    : status === 'success' ? '✓'
    : status === 'error' ? '✗'
    : '○';

  const statusColor = status === 'running' ? 'yellow'
    : status === 'success' ? 'green'
    : status === 'error' ? 'red'
    : 'gray';

  const args = formatArgs(toolCall.input);
  const hasOutput = result || error;

  const resultDisplay = result ? truncateResult(result, expanded ? 100 : 3) : null;

  return (
    <Box flexDirection="column">
      {/* Main line: icon tool_name(args) duration */}
      <Box>
        <Text color={statusColor}>{statusIcon}</Text>
        <Text> </Text>
        <Text color="blue" bold>{toolCall.name}</Text>
        <Text color="gray">(</Text>
        <Text color="gray" dimColor>{args}</Text>
        <Text color="gray">)</Text>
        {duration != null && duration > 0 && (
          <Text color="gray" dimColor> · {formatDuration(duration)}</Text>
        )}
        {hasOutput && resultDisplay?.truncated && result!.split('\n').length > 3 && (
          <Text color="gray" dimColor> [+{result!.split('\n').length - 3} lines]</Text>
        )}
      </Box>

      {/* Result/error output */}
      {hasOutput && (
        <Box marginLeft={2} marginTop={0}>
          {error ? (
            <Text color="red">{error}</Text>
          ) : resultDisplay ? (
            <Text color="gray" dimColor wrap="truncate-end">
              {resultDisplay.text}
            </Text>
          ) : null}
        </Box>
      )}
    </Box>
  );
};
