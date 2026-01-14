import type { ContentBlock } from '../conversation/types.js';

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
