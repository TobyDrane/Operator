/**
 * @file orchestrator.ts
 * @description Main agent loop that coordinates LLM calls, tool execution,
 * and event emission. Manages the conversation flow and handles interrupts.
 */

import { TypedEventEmitter } from '../events/index.js';
import { MessageHistory } from '../conversation/index.js';
import { ToolRegistry, builtinTools } from '../tools/index.js';
import { AnthropicClient } from '../llm/index.js';
import { Session } from './session.js';
import type { AgentConfig, AgentState, AgentError, ContentBlock } from '../types.js';

export class Orchestrator {
  readonly events: TypedEventEmitter;
  readonly session: Session;
  private history: MessageHistory;
  private tools: ToolRegistry;
  private llm: AnthropicClient;
  private state: AgentState = 'idle';
  private abortController: AbortController | null = null;

  constructor(config: AgentConfig) {
    this.events = new TypedEventEmitter();
    this.session = new Session(config);
    this.history = new MessageHistory();
    this.tools = new ToolRegistry();
    this.llm = new AnthropicClient({
      model: config.model,
      maxTokens: config.maxTokens,
      systemPrompt: config.systemPrompt
    });

    // Register built-in tools
    for (const tool of builtinTools) {
      this.tools.register(tool.definition, tool.executor);
    }
  }

  registerTool(
    definition: Parameters<ToolRegistry['register']>[0],
    executor: Parameters<ToolRegistry['register']>[1]
  ): void {
    this.tools.register(definition, executor);
  }

  async submit(userMessage: string): Promise<void> {
    if (this.state === 'running') {
      return;
    }

    this.setState('running');
    this.abortController = new AbortController();
    this.history.addUserMessage(userMessage);

    try {
      await this.runAgentLoop();
      this.setState('idle');
    } catch (error) {
      this.handleError(error);
    } finally {
      this.abortController = null;
    }
  }

  interrupt(): void {
    this.abortController?.abort();
    this.setState('idle');
  }

  getState(): AgentState {
    return this.state;
  }

  private async runAgentLoop(): Promise<void> {
    let turns = 0;
    const maxTurns = this.session.config.maxTurns;

    while (turns < maxTurns) {
      if (this.abortController?.signal.aborted) {
        break;
      }

      const response = await this.llm.streamMessage(
        this.history.getMessages(),
        this.tools.getDefinitions(),
        {
          onTextDelta: (text: string) => {
            this.events.emit({ type: 'text_delta', text });
          },
          onToolUse: (id: string, name: string, input: Record<string, unknown>) => {
            this.events.emit({ type: 'tool_start', toolId: id, toolName: name, input });
          }
        }
      );

      this.history.addAssistantMessage(response.content);
      this.session.addTokenUsage(response.usage.inputTokens, response.usage.outputTokens);
      this.events.emit({
        type: 'token_usage',
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens
      });

      if (response.stopReason === 'end_turn') {
        break;
      }

      if (response.stopReason === 'tool_use') {
        await this.executeTools(response.content);
      }

      turns++;
    }
  }

  private async executeTools(content: ContentBlock[]): Promise<void> {
    const toolUses = content.filter(c => c.type === 'tool_use');

    for (const toolUse of toolUses) {
      if (toolUse.type !== 'tool_use') continue;

      try {
        const result = await this.tools.execute(toolUse.name, toolUse.input);
        this.history.addToolResult(toolUse.id, result, false);
        this.events.emit({ type: 'tool_end', toolId: toolUse.id, result });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.history.addToolResult(toolUse.id, errorMessage, true);
        this.events.emit({ type: 'tool_end', toolId: toolUse.id, result: null, error: error as Error });
      }
    }
  }

  private setState(state: AgentState): void {
    this.state = state;
    this.events.emit({ type: 'state_change', state });
  }

  private handleError(error: unknown): void {
    const agentError: AgentError = {
      code: 'unknown',
      message: error instanceof Error ? error.message : String(error),
      details: error
    };

    if (error instanceof Error && error.name === 'APIError') {
      agentError.code = 'api_error';
    }

    this.events.emit({ type: 'error', error: agentError });
    this.setState('error');
  }
}
