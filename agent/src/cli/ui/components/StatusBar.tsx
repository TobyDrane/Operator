import React from 'react';
import { Box, Text } from 'ink';
import type { SessionInfo } from '../../../core/types.js';

interface StatusBarProps {
  session: SessionInfo;
}

export const StatusBar: React.FC<StatusBarProps> = ({ session }) => {
  const totalTokens = session.totalInputTokens + session.totalOutputTokens;

  return (
    <Box paddingX={1} justifyContent="space-between">
      <Text color="cyan">{session.model}</Text>
      <Text color="gray">
        Tokens: {totalTokens.toLocaleString()} (in: {session.totalInputTokens.toLocaleString()}, out: {session.totalOutputTokens.toLocaleString()})
      </Text>
      <Text color="gray" dimColor>{session.workingDirectory}</Text>
    </Box>
  );
};
