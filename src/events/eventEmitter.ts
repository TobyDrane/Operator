/**
 * @file eventEmitter.ts
 * @description Typed event emitter for agent communication. Provides type-safe
 * event handling for agent state changes, tool execution, and token usage tracking.
 */

import type { AgentEvent, EventType, EventHandler } from './types.js';

export class TypedEventEmitter {
  private listeners: Map<EventType, Set<EventHandler<AgentEvent>>> = new Map();

  on<K extends EventType>(
    type: K,
    handler: EventHandler<Extract<AgentEvent, { type: K }>>
  ): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler as EventHandler<AgentEvent>);

    // Return unsubscribe function
    return () => this.off(type, handler);
  }

  off<K extends EventType>(
    type: K,
    handler: EventHandler<Extract<AgentEvent, { type: K }>>
  ): void {
    this.listeners.get(type)?.delete(handler as EventHandler<AgentEvent>);
  }

  emit<K extends EventType>(event: Extract<AgentEvent, { type: K }>): void {
    const handlers = this.listeners.get(event.type);
    handlers?.forEach(handler => handler(event));
  }

  removeAllListeners(): void {
    this.listeners.clear();
  }
}
