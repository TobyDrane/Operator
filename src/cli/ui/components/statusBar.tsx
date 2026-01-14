import React from 'react';
import { Box, Text } from 'ink';
import type { SessionInfo } from '../../../core/types.js';
import type { AgentState } from '../../../events/types.js';

interface StatusBarProps {
  session: SessionInfo;
  state: AgentState;
}

function formatTokens(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

export const StatusBar: React.FC<StatusBarProps> = ({ session, state }) => {
  const stateColors: Record<AgentState, string> = {
    idle: 'green',
    running: 'yellow',
    error: 'red'
  };

  return (
    <Box paddingX={1} justifyContent="space-between" borderStyle="single" borderColor="gray">
      <Box>
        <Text color="cyan" bold>{session.model}</Text>
        <Text color={stateColors[state]}> [{state}]</Text>
      </Box>
      <Box>
        <Text color="gray">↑ </Text>
        <Text color="green">{formatTokens(session.totalInputTokens)}</Text>
        <Text color="gray"> ↓ </Text>
        <Text color="blue">{formatTokens(session.totalOutputTokens)}</Text>
        <Text color="gray"> tokens</Text>
      </Box>
      <Text color="gray" dimColor>{session.workingDirectory}</Text>
    </Box>
  );
};
