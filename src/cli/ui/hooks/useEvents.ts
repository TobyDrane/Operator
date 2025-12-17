import { useEffect, useState, useRef, useCallback } from 'react';
import type { TypedEventEmitter } from '../../../events/index.js';
import type { AgentEvent, EventType } from '../../../types.js';

export function useEvents<K extends EventType>(
  emitter: TypedEventEmitter,
  eventType: K,
  batchMs: number = 16
): Extract<AgentEvent, { type: K }>[] {
  const [events, setEvents] = useState<Extract<AgentEvent, { type: K }>[]>([]);
  const batchRef = useRef<Extract<AgentEvent, { type: K }>[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const flush = useCallback(() => {
    if (batchRef.current.length > 0) {
      setEvents(prev => [...prev, ...batchRef.current]);
      batchRef.current = [];
    }
    timeoutRef.current = null;
  }, []);

  useEffect(() => {
    const handler = (event: Extract<AgentEvent, { type: K }>) => {
      batchRef.current.push(event);
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(flush, batchMs);
      }
    };

    const unsubscribe = emitter.on(eventType, handler);

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        flush();
      }
    };
  }, [emitter, eventType, batchMs, flush]);

  return events;
}

export function useLatestEvent<K extends EventType>(
  emitter: TypedEventEmitter,
  eventType: K
): Extract<AgentEvent, { type: K }> | null {
  const [event, setEvent] = useState<Extract<AgentEvent, { type: K }> | null>(null);

  useEffect(() => {
    const unsubscribe = emitter.on(eventType, setEvent);
    return unsubscribe;
  }, [emitter, eventType]);

  return event;
}
