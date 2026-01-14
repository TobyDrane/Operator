// Event type definitions for the agent system

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

export type AgentEvent =
  | TextDeltaEvent
  | ToolStartEvent
  | ToolEndEvent
  | StateChangeEvent
  | ErrorEvent
  | TokenUsageEvent;

export type EventType = AgentEvent['type'];

export interface AgentError {
  code: 'tool_error' | 'api_error' | 'validation_error' | 'unknown';
  message: string;
  details?: unknown;
}

export type EventHandler<T extends AgentEvent> = (event: T) => void;
