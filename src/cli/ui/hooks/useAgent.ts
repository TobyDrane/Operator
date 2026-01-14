import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Orchestrator } from '../../../core/index.js';
import type { AgentState } from '../../../events/types.js';
import type { ToolCall, ToolState } from '../../../tools/types.js';

interface ToolStatus {
  call: ToolCall;
  state: ToolState;
  result?: string;
  error?: string;
}

interface UseAgentReturn {
  state: AgentState;
  output: string;
  tools: ToolStatus[];
  isThinking: boolean;
  submit: (message: string) => void;
  interrupt: () => void;
  clearOutput: () => void;
}

export function useAgent(orchestrator: Orchestrator): UseAgentReturn {
  const [state, setState] = useState<AgentState>('idle');
  const [output, setOutput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [toolStatuses, setToolStatuses] = useState<Map<string, ToolStatus>>(new Map());

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      orchestrator.events.on('state_change', (event) => {
        setState(event.state);
        if (event.state === 'idle') {
          setToolStatuses(new Map());
          setIsThinking(false);
        }
        if (event.state === 'running') {
          setIsThinking(true);
        }
      })
    );

    unsubscribers.push(
      orchestrator.events.on('text_delta', (event) => {
        setOutput(prev => prev + event.text);
        setIsThinking(false);
      })
    );

    unsubscribers.push(
      orchestrator.events.on('tool_start', (event) => {
        setIsThinking(false);
        setToolStatuses(prev => {
          const next = new Map(prev);
          next.set(event.toolId, {
            call: {
              id: event.toolId,
              name: event.toolName,
              input: event.input
            },
            state: 'running'
          });
          return next;
        });
      })
    );

    unsubscribers.push(
      orchestrator.events.on('tool_end', (event) => {
        setIsThinking(true);
        setToolStatuses(prev => {
          const next = new Map(prev);
          const existing = next.get(event.toolId);
          if (existing) {
            next.set(event.toolId, {
              ...existing,
              state: event.error ? 'error' : 'success',
              result: event.error ? undefined : String(event.result),
              error: event.error?.message
            });
          }
          return next;
        });
      })
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [orchestrator]);

  const submit = useCallback((message: string) => {
    setOutput('');
    setIsThinking(true);
    orchestrator.submit(message);
  }, [orchestrator]);

  const interrupt = useCallback(() => {
    orchestrator.interrupt();
    setIsThinking(false);
  }, [orchestrator]);

  const clearOutput = useCallback(() => {
    setOutput('');
  }, []);

  const tools = useMemo(() =>
    Array.from(toolStatuses.values()),
    [toolStatuses]
  );

  return { state, output, tools, isThinking, submit, interrupt, clearOutput };
}
