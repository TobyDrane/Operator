import { readFile, writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import type { ToolDefinition, ToolExecutor } from './types.js';

const execAsync = promisify(exec);

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

export const builtinTools = [
  { definition: readFileTool, executor: readFileExecutor },
  { definition: writeFileTool, executor: writeFileExecutor },
  { definition: runShellTool, executor: runShellExecutor }
];
