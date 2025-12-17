/**
 * @file readFile.ts
 * @description Tool for reading file contents from the filesystem
 */

import { readFile } from 'fs/promises';
import type { ToolDefinition, ToolExecutor } from '../types.js';

export const readFileTool: ToolDefinition = {
  name: 'read_file',
  description: 'Read the contents of a file at the specified path',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'The path to the file to read'
      }
    },
    required: ['path']
  }
};

export const readFileExecutor: ToolExecutor = async (input) => {
  const { path } = input as { path: string };
  const content = await readFile(path, 'utf-8');
  return content;
};
