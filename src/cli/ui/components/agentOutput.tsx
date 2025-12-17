/**
 * @file agentOutput.tsx
 * @description Agent text output with code block detection and highlighting
 */

import React from 'react';
import { Box, Text } from 'ink';
import { CodeBlock } from './codeBlock.js';

interface AgentOutputProps {
  text: string;
}

interface ParsedBlock {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

function parseMarkdownBlocks(text: string): ParsedBlock[] {
  const blocks: ParsedBlock[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;

  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      blocks.push({
        type: 'text',
        content: text.slice(lastIndex, match.index)
      });
    }

    // Add code block
    blocks.push({
      type: 'code',
      content: match[2],
      language: match[1] || undefined
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    blocks.push({
      type: 'text',
      content: text.slice(lastIndex)
    });
  }

  return blocks.length > 0 ? blocks : [{ type: 'text', content: text }];
}

export const AgentOutput: React.FC<AgentOutputProps> = ({ text }) => {
  if (!text) {
    return null;
  }

  const blocks = parseMarkdownBlocks(text);

  return (
    <Box flexDirection="column">
      {blocks.map((block, i) =>
        block.type === 'code' ? (
          <CodeBlock key={i} code={block.content} language={block.language} />
        ) : (
          <Text key={i}>{block.content}</Text>
        )
      )}
    </Box>
  );
};
