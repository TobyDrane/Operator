import React, { useState, useEffect } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { useAgent } from './hooks/useAgent.js';
import { useLatestEvent } from './hooks/useEvents.js';
import { AgentOutput } from './components/AgentOutput.js';
import { ToolStatus } from './components/ToolStatus.js';
import { InputPrompt } from './components/InputPrompt.js';
import { StatusBar } from './components/StatusBar.js';
import { ErrorDisplay } from './components/ErrorDisplay.js';
import type { Orchestrator } from '../../core/index.js';
import type { AgentError } from '../../events/types.js';

interface AppProps {
  orchestrator: Orchestrator;
}

export const App: React.FC<AppProps> = ({ orchestrator }) => {
  const { exit } = useApp();
  const { state, output, tools, submit, interrupt } = useAgent(orchestrator);
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
      <StatusBar session={sessionInfo} />

      <Box flexDirection="column" paddingX={1}>
        {output && <AgentOutput text={output} />}

        {tools.length > 0 && (
          <Box flexDirection="column" marginY={1}>
            {tools.map(t => (
              <ToolStatus key={t.call.id} toolCall={t.call} status={t.state} />
            ))}
          </Box>
        )}

        {error && (
          <Box marginY={1} flexDirection="column">
            <ErrorDisplay error={error} />
            <Text color="gray" dimColor> (Press Escape to dismiss)</Text>
          </Box>
        )}
      </Box>

      <Box paddingX={1}>
        <InputPrompt
          onSubmit={submit}
          disabled={state === 'running'}
        />
        {state === 'running' && (
          <Text color="yellow"> Processing... (Ctrl+C to interrupt)</Text>
        )}
      </Box>
    </Box>
  );
};
