/**
 * @file writeFile.ts
 * @description Tool for writing content to files on the filesystem
 */

import { writeFile } from 'fs/promises';
import type { ToolDefinition, ToolExecutor } from '../types.js';

export const writeFileTool: ToolDefinition = {
  name: 'write_file',
  description: 'Write content to a file at the specified path',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'The path to the file to write'
      },
      content: {
        type: 'string',
        description: 'The content to write to the file'
      }
    },
    required: ['path', 'content']
  }
};

export const writeFileExecutor: ToolExecutor = async (input) => {
  const { path, content } = input as { path: string; content: string };
  await writeFile(path, content, 'utf-8');
  return `Successfully wrote to ${path}`;
};
