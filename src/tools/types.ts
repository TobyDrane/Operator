export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, PropertySchema>;
    required?: string[];
  };
}

export interface PropertySchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description?: string;
  enum?: string[];
  items?: PropertySchema;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export type ToolState = 'pending' | 'running' | 'success' | 'error';

export interface ToolResult {
  toolUseId: string;
  result: string;
  isError: boolean;
}

export type ToolExecutor = (input: Record<string, unknown>) => Promise<string>;
