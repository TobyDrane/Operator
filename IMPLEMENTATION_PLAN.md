# CLI Agent Bootstrap Implementation Plan

## Overview

Bootstrap a CLI agent built with **Ink** (React for terminals) that interfaces with Claude via the Anthropic SDK. The project follows an event-driven architecture with clean separation between UI, orchestration, and LLM layers.

## Directory Structure

```
agent/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                    # Entry point
    ├── cli/
    │   ├── index.ts                # CLI bootstrap & arg parsing
    │   └── ui/
    │       ├── App.tsx             # Root Ink component
    │       ├── components/
    │       │   ├── AgentOutput.tsx
    │       │   ├── ToolStatus.tsx
    │       │   ├── InputPrompt.tsx
    │       │   ├── StatusBar.tsx
    │       │   └── ErrorDisplay.tsx
    │       └── hooks/
    │           ├── useAgent.ts
    │           └── useEvents.ts
    ├── core/                       # Orchestrator, Session
    ├── conversation/               # Message history
    ├── tools/                      # Tool registry
    ├── llm/                        # Anthropic client
    ├── events/                     # Typed event emitter
    └── utils/                      # Helpers
```

## Implementation Phases

### Phase 1: Project Foundation
| File | Description |
|------|-------------|
| `agent/package.json` | Dependencies: ink, react, chalk, @anthropic-ai/sdk |
| `agent/tsconfig.json` | TypeScript config with JSX support |

### Phase 2: Events System
| File | Description |
|------|-------------|
| `src/events/types.ts` | AgentEvent union type, AgentState, AgentError |
| `src/events/EventEmitter.ts` | TypedEventEmitter with on/off/emit |
| `src/events/index.ts` | Barrel export |

### Phase 3: Domain Layer
| File | Description |
|------|-------------|
| `src/conversation/types.ts` | Message, ContentBlock types |
| `src/conversation/MessageHistory.ts` | Conversation management |
| `src/tools/types.ts` | ToolDefinition, ToolCall, ToolState |
| `src/tools/registry.ts` | ToolRegistry class |
| `src/tools/builtins.ts` | Built-in tools: read_file, write_file, run_shell |
| `src/llm/types.ts` | LLMResponse, StreamCallbacks |
| `src/llm/AnthropicClient.ts` | Anthropic SDK wrapper with streaming |

### Phase 4: Core Orchestration
| File | Description |
|------|-------------|
| `src/core/types.ts` | AgentConfig, SessionInfo |
| `src/core/Session.ts` | Session state & token tracking |
| `src/core/Orchestrator.ts` | Agent loop, tool execution, event emission |

### Phase 5: UI Hooks
| File | Description |
|------|-------------|
| `src/cli/ui/hooks/useEvents.ts` | Event subscription with batching |
| `src/cli/ui/hooks/useAgent.ts` | Connects UI to orchestrator |

### Phase 6: UI Components
| File | Description |
|------|-------------|
| `src/cli/ui/components/ErrorDisplay.tsx` | Error rendering with type labels |
| `src/cli/ui/components/StatusBar.tsx` | Model, tokens, working directory |
| `src/cli/ui/components/ToolStatus.tsx` | Spinner + tool name/status |
| `src/cli/ui/components/AgentOutput.tsx` | Streaming text display |
| `src/cli/ui/components/InputPrompt.tsx` | Text input with submit |

### Phase 7: Application Shell
| File | Description |
|------|-------------|
| `src/cli/ui/App.tsx` | Root component, keyboard handling |
| `src/cli/index.ts` | CLI bootstrap, arg parsing, render |
| `src/index.ts` | Entry point (shebang) |
| `src/utils/index.ts` | Utility functions |

## Critical Files

1. **`src/core/Orchestrator.ts`** - Central agent loop coordinating LLM, tools, events
2. **`src/cli/ui/hooks/useAgent.ts`** - Bridge between React UI and orchestrator
3. **`src/llm/AnthropicClient.ts`** - Streaming API wrapper
4. **`src/events/EventEmitter.ts`** - Typed event system
5. **`src/cli/ui/App.tsx`** - Root UI component

## Configuration

- **Default Model**: `claude-opus-4-5-20251101`
- **Built-in Tools**: `read_file`, `write_file`, `run_shell`

## Key Architecture Decisions

- **Typed Events**: Type-safe event handling with auto-unsubscribe
- **Streaming**: Events emitted during LLM streaming for real-time UI
- **Hook-based UI**: Clean `useAgent` interface for React components
- **Event Batching**: Prevents excessive re-renders during rapid streaming
- **Sequential Tool Execution**: Tools run one at a time with error handling

## Git Workflow

Each implementation phase should be committed as a **stacked PR via Graphite**:

```bash
# After completing each phase:
gt create -am "phase-N: description"   # Create branch with staged changes
gt submit                               # Push and create PR

# To sync and continue:
gt sync                                 # Pull trunk, restack
```

**Branch naming convention:**
- `phase-1-project-foundation`
- `phase-2-events-system`
- `phase-3-domain-layer`
- `phase-4-core-orchestration`
- `phase-5-ui-hooks`
- `phase-6-ui-components`
- `phase-7-application-shell`

## Post-Bootstrap

After initial scaffolding:
1. Run `npm install` in `agent/`
2. Run `npm run build` to compile TypeScript
3. Run `npm start` to launch the CLI
