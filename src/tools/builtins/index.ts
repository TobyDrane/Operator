/**
 * @file index.ts
 * @description Barrel export for all built-in agent tools
 */

export { readFileTool, readFileExecutor } from './readFile.js';
export { writeFileTool, writeFileExecutor } from './writeFile.js';
export { runShellTool, runShellExecutor } from './runShell.js';

import { readFileTool, readFileExecutor } from './readFile.js';
import { writeFileTool, writeFileExecutor } from './writeFile.js';
import { runShellTool, runShellExecutor } from './runShell.js';

export const builtinTools = [
  { definition: readFileTool, executor: readFileExecutor },
  { definition: writeFileTool, executor: writeFileExecutor },
  { definition: runShellTool, executor: runShellExecutor }
];
