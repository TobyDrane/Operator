import React, { useState, useEffect } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { useAgent } from './hooks/useAgent.js';
import { useLatestEvent } from './hooks/useEvents.js';
import { AgentOutput } from './components/AgentOutput.js';
import { ToolStatus } from './components/ToolStatus.js';
import { InputPrompt } from './components/InputPrompt.js';
import { StatusBar } from './components/StatusBar.js';
import { ErrorDisplay } from './components/ErrorDisplay.js';
import { ThinkingIndicator } from './components/ThinkingIndicator.js';
import type { Orchestrator } from '../../core/index.js';
import type { AgentError } from '../../events/types.js';

interface AppProps {
  orchestrator: Orchestrator;
}

export const App: React.FC<AppProps> = ({ orchestrator }) => {
  const { exit } = useApp();
  const { state, output, tools, isThinking, submit, interrupt } = useAgent(orchestrator);
  const [error, setError] = useState<AgentError | null>(null);

  const errorEvent = useLatestEvent(orchestrator.events, 'error');

  useEffect(() => {
    if (errorEvent) {
      setError(errorEvent.error);
    }
  }, [errorEvent]);

  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      if (state === 'running') {
        interrupt();
      } else {
        exit();
      }
    }
    if (key.escape && error) {
      setError(null);
    }
  });

  const sessionInfo = orchestrator.session.getInfo();

  return (
    <Box flexDirection="column">
      <StatusBar session={sessionInfo} state={state} />

      <Box flexDirection="column" paddingX={1} paddingY={1}>
        {/* Thinking indicator */}
        <ThinkingIndicator isThinking={isThinking && tools.length === 0 && !output} />

        {/* Tool executions */}
        {tools.length > 0 && (
          <Box flexDirection="column" marginBottom={1}>
            {tools.map(t => (
              <Box key={t.call.id} marginBottom={1}>
                <ToolStatus
                  toolCall={t.call}
                  status={t.state}
                  result={t.result}
                  error={t.error}
                />
              </Box>
            ))}
            {isThinking && <ThinkingIndicator isThinking={true} />}
          </Box>
        )}

        {/* Agent output */}
        {output && <AgentOutput text={output} />}

        {/* Error display */}
        {error && (
          <Box marginY={1} flexDirection="column">
            <ErrorDisplay error={error} />
            <Text color="gray" dimColor> (Press Escape to dismiss)</Text>
          </Box>
        )}
      </Box>

      {/* Input area */}
      <Box paddingX={1} borderStyle="single" borderColor="gray" borderTop borderBottom={false} borderLeft={false} borderRight={false}>
        <InputPrompt
          onSubmit={submit}
          disabled={state === 'running'}
        />
        {state === 'running' && (
          <Text color="yellow"> (Ctrl+C to interrupt)</Text>
        )}
      </Box>
    </Box>
  );
};
