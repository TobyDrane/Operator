import type { SessionInfo, AgentConfig } from './types.js';

export class Session {
  private inputTokens: number = 0;
  private outputTokens: number = 0;
  readonly config: AgentConfig;
  readonly workingDirectory: string;

  constructor(config: AgentConfig) {
    this.config = config;
    this.workingDirectory = process.cwd();
  }

  addTokenUsage(input: number, output: number): void {
    this.inputTokens += input;
    this.outputTokens += output;
  }

  getInfo(): SessionInfo {
    return {
      model: this.config.model,
      totalInputTokens: this.inputTokens,
      totalOutputTokens: this.outputTokens,
      workingDirectory: this.workingDirectory
    };
  }
}
