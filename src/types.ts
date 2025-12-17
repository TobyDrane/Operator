/**
 * @file types.ts
 * @description Centralized type definitions for the CLI agent
 */

// =============================================================================
// Agent State & Events
// =============================================================================

export type AgentState = 'idle' | 'running' | 'error';

export interface TextDeltaEvent {
  type: 'text_delta';
  text: string;
}

export interface ToolStartEvent {
  type: 'tool_start';
  toolName: string;
  toolId: string;
  input: Record<string, unknown>;
}

export interface ToolEndEvent {
  type: 'tool_end';
  toolId: string;
  result: unknown;
  error?: Error;
}

export interface StateChangeEvent {
  type: 'state_change';
  state: AgentState;
}

export interface ErrorEvent {
  type: 'error';
  error: AgentError;
}

export interface TokenUsageEvent {
  type: 'token_usage';
  inputTokens: number;
  outputTokens: number;
}

export interface ThinkingEvent {
  type: 'thinking';
  text: string;
}

export type AgentEvent =
  | TextDeltaEvent
  | ToolStartEvent
  | ToolEndEvent
  | StateChangeEvent
  | ErrorEvent
  | TokenUsageEvent
  | ThinkingEvent;

export type EventType = AgentEvent['type'];

export interface AgentError {
  code: 'tool_error' | 'api_error' | 'validation_error' | 'unknown';
  message: string;
  details?: unknown;
}

export type EventHandler<T extends AgentEvent> = (event: T) => void;

// =============================================================================
// Conversation
// =============================================================================

export interface Message {
  role: 'user' | 'assistant';
  content: ContentBlock[];
}

export type ContentBlock = TextContent | ToolUseContent | ToolResultContent;

export interface TextContent {
  type: 'text';
  text: string;
}

export interface ToolUseContent {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultContent {
  type: 'tool_result';
  tool_use_id: string;
  content: string;
  is_error?: boolean;
}

// =============================================================================
// Tools
// =============================================================================

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

// =============================================================================
// LLM
// =============================================================================

export interface LLMResponse {
  content: ContentBlock[];
  stopReason: 'end_turn' | 'tool_use' | 'max_tokens' | 'stop_sequence';
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface StreamCallbacks {
  onTextDelta?: (text: string) => void;
  onToolUse?: (toolId: string, toolName: string, input: Record<string, unknown>) => void;
}

// =============================================================================
// Core / Config
// =============================================================================

export interface AgentConfig {
  model: string;
  maxTokens: number;
  systemPrompt: string;
  maxTurns: number;
}

export interface SessionInfo {
  model: string;
  totalInputTokens: number;
  totalOutputTokens: number;
  workingDirectory: string;
}
