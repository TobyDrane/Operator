import Anthropic from '@anthropic-ai/sdk';
import type { Message, ContentBlock } from '../conversation/types.js';
import type { ToolDefinition } from '../tools/types.js';
import type { LLMResponse, StreamCallbacks } from './types.js';

export interface ClientConfig {
  model: string;
  maxTokens: number;
  systemPrompt?: string;
}

export class AnthropicClient {
  private client: Anthropic;
  private config: ClientConfig;

  constructor(config: ClientConfig) {
    this.client = new Anthropic();
    this.config = config;
  }

  async streamMessage(
    messages: Message[],
    tools: ToolDefinition[],
    callbacks: StreamCallbacks
  ): Promise<LLMResponse> {
    const content: ContentBlock[] = [];

    const stream = this.client.messages.stream({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      system: this.config.systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      tools: tools.length > 0 ? tools.map(t => ({
        name: t.name,
        description: t.description,
        input_schema: t.inputSchema
      })) : undefined
    });

    stream.on('text', (text: string) => {
      callbacks.onTextDelta?.(text);
    });

    stream.on('contentBlock', (block: Anthropic.ContentBlock) => {
      if (block.type === 'text') {
        content.push({ type: 'text', text: block.text });
      } else if (block.type === 'tool_use') {
        content.push({
          type: 'tool_use',
          id: block.id,
          name: block.name,
          input: block.input as Record<string, unknown>
        });
        callbacks.onToolUse?.(block.id, block.name, block.input as Record<string, unknown>);
      }
    });

    const finalMessage = await stream.finalMessage();

    return {
      content,
      stopReason: finalMessage.stop_reason as LLMResponse['stopReason'],
      usage: {
        inputTokens: finalMessage.usage.input_tokens,
        outputTokens: finalMessage.usage.output_tokens
      }
    };
  }
}
