/**
 * @file runShell.ts
 * @description Tool for executing shell commands and capturing output
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import type { ToolDefinition, ToolExecutor } from '../../types.js';

const execAsync = promisify(exec);

export const runShellTool: ToolDefinition = {
  name: 'run_shell',
  description: 'Execute a shell command and return its output',
  inputSchema: {
    type: 'object',
    properties: {
      command: {
        type: 'string',
        description: 'The shell command to execute'
      }
    },
    required: ['command']
  }
};

export const runShellExecutor: ToolExecutor = async (input) => {
  const { command } = input as { command: string };
  const { stdout, stderr } = await execAsync(command);
  return stdout + (stderr ? `\nSTDERR: ${stderr}` : '');
};
