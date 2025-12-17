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
