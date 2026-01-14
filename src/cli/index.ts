import { render } from 'ink';
import React from 'react';
import { App } from './ui/app.js';
import { Orchestrator } from '../core/index.js';
import type { AgentConfig } from '../core/types.js';

interface CLIOptions {
  model?: string;
  maxTokens?: number;
  systemPrompt?: string;
}

function parseArgs(): CLIOptions {
  const args = process.argv.slice(2);
  const options: CLIOptions = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--model':
      case '-m':
        options.model = args[++i];
        break;
      case '--max-tokens':
        options.maxTokens = parseInt(args[++i], 10);
        break;
      case '--system':
      case '-s':
        options.systemPrompt = args[++i];
        break;
    }
  }

  return options;
}

export function startCLI(): void {
  const options = parseArgs();

  const config: AgentConfig = {
    model: options.model || 'claude-opus-4-5-20251101',
    maxTokens: options.maxTokens || 4096,
    systemPrompt: options.systemPrompt || 'You are a helpful assistant.',
    maxTurns: 10
  };

  const orchestrator = new Orchestrator(config);

  process.on('SIGINT', () => {
    orchestrator.interrupt();
  });

  const { waitUntilExit } = render(
    React.createElement(App, { orchestrator })
  );

  waitUntilExit().then(() => {
    process.exit(0);
  });
}
