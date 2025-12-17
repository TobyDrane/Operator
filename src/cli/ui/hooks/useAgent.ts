import { useState, useEffect, useCallback } from 'react';
import type { Orchestrator } from '../../../core/index.js';
import type { AgentState } from '../../../events/types.js';
import type { ToolCall, ToolState } from '../../../tools/types.js';

interface ToolBlock {
  type: 'tool';
  id: string;
  call: ToolCall;
  state: ToolState;
  result?: string;
  error?: string;
}

interface TextBlock {
  type: 'text';
  id: string;
  content: string;
}

type ContentBlock = ToolBlock | TextBlock;

interface UseAgentReturn {
  state: AgentState;
  content: ContentBlock[];
  isThinking: boolean;
  submit: (message: string) => void;
  interrupt: () => void;
  clear: () => void;
}

export function useAgent(orchestrator: Orchestrator): UseAgentReturn {
  const [state, setState] = useState<AgentState>('idle');
  const [content, setContent] = useState<ContentBlock[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [currentTextId, setCurrentTextId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    unsubscribers.push(
      orchestrator.events.on('state_change', (event) => {
        setState(event.state);
        if (event.state === 'idle') {
          setIsThinking(false);
          setCurrentTextId(null);
        }
        if (event.state === 'running') {
          setIsThinking(true);
        }
      })
    );

    unsubscribers.push(
      orchestrator.events.on('text_delta', (event) => {
        setIsThinking(false);
        setContent(prev => {
          // Find or create current text block
          const lastBlock = prev[prev.length - 1];
          if (lastBlock?.type === 'text') {
            // Append to existing text block
            return prev.map((block, i) =>
              i === prev.length - 1 && block.type === 'text'
                ? { ...block, content: block.content + event.text }
                : block
            );
          } else {
            // Create new text block
            const newId = `text-${Date.now()}`;
            setCurrentTextId(newId);
            return [...prev, { type: 'text', id: newId, content: event.text }];
          }
        });
      })
    );

    unsubscribers.push(
      orchestrator.events.on('tool_start', (event) => {
        setIsThinking(false);
        setCurrentTextId(null); // End current text block
        setContent(prev => [
          ...prev,
          {
            type: 'tool',
            id: event.toolId,
            call: {
              id: event.toolId,
              name: event.toolName,
              input: event.input
            },
            state: 'running'
          }
        ]);
      })
    );

    unsubscribers.push(
      orchestrator.events.on('tool_end', (event) => {
        setIsThinking(true);
        setContent(prev => prev.map(block =>
          block.type === 'tool' && block.id === event.toolId
            ? {
                ...block,
                state: event.error ? 'error' : 'success',
                result: event.error ? undefined : String(event.result),
                error: event.error?.message
              }
            : block
        ));
      })
    );

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [orchestrator]);

  const submit = useCallback((message: string) => {
    setContent([]);
    setCurrentTextId(null);
    setIsThinking(true);
    orchestrator.submit(message);
  }, [orchestrator]);

  const interrupt = useCallback(() => {
    orchestrator.interrupt();
    setIsThinking(false);
  }, [orchestrator]);

  const clear = useCallback(() => {
    setContent([]);
    setCurrentTextId(null);
  }, []);

  return { state, content, isThinking, submit, interrupt, clear };
}

export type { ContentBlock, ToolBlock, TextBlock };
