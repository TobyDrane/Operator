/**
 * @file messageHistory.ts
 * @description Manages conversation history with the LLM. Stores user messages,
 * assistant responses, and tool results with automatic trimming to prevent context overflow.
 */

import type { Message, ContentBlock } from './types.js';

export class MessageHistory {
  private messages: Message[] = [];
  private maxMessages: number;

  constructor(maxMessages: number = 100) {
    this.maxMessages = maxMessages;
  }

  addUserMessage(text: string): void {
    this.messages.push({
      role: 'user',
      content: [{ type: 'text', text }]
    });
    this.trim();
  }

  addAssistantMessage(content: ContentBlock[]): void {
    this.messages.push({
      role: 'assistant',
      content
    });
    this.trim();
  }

  addToolResult(toolUseId: string, result: string, isError: boolean = false): void {
    this.messages.push({
      role: 'user',
      content: [{
        type: 'tool_result',
        tool_use_id: toolUseId,
        content: result,
        is_error: isError
      }]
    });
    this.trim();
  }

  getMessages(): Message[] {
    return [...this.messages];
  }

  clear(): void {
    this.messages = [];
  }

  private trim(): void {
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }
  }
}
