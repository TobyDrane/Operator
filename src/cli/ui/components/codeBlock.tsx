/**
 * @file codeBlock.tsx
 * @description Syntax-highlighted code block component
 */

import React from 'react';
import { Box, Text } from 'ink';
import { highlight } from 'cli-highlight';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  let highlighted: string;
  try {
    highlighted = highlight(code, { language: language || 'auto', ignoreIllegals: true });
  } catch {
    highlighted = code;
  }

  return (
    <Box flexDirection="column" marginY={1} paddingX={1} borderStyle="single" borderColor="gray">
      {language && <Text color="gray" dimColor>{language}</Text>}
      <Text>{highlighted}</Text>
    </Box>
  );
};
