/**
 * @file toolRegistry.ts
 * @description Registry for tool definitions and executors. Manages the collection
 * of available tools that the agent can invoke during conversation.
 */

import type { ToolDefinition, ToolExecutor } from './types.js';

interface RegisteredTool {
  definition: ToolDefinition;
  execute: ToolExecutor;
}

export class ToolRegistry {
  private tools: Map<string, RegisteredTool> = new Map();

  register(definition: ToolDefinition, executor: ToolExecutor): void {
    this.tools.set(definition.name, {
      definition,
      execute: executor
    });
  }

  get(name: string): RegisteredTool | undefined {
    return this.tools.get(name);
  }

  getDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map(t => t.definition);
  }

  async execute(name: string, input: Record<string, unknown>): Promise<string> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }
    return tool.execute(input);
  }
}
