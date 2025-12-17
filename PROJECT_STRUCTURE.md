Project Structure (with Ink)

agent/
├── package.json
├── tsconfig.json
├── src/
│ ├── index.ts # Entry point
│ │
│ ├── cli/
│ │ ├── index.ts # CLI bootstrap & arg parsing
│ │ └── ui/
│ │ ├── App.tsx # Root Ink component
│ │ ├── components/
│ │ │ ├── AgentOutput.tsx # Streaming text display
│ │ │ ├── ToolStatus.tsx # Tool execution indicator
│ │ │ ├── InputPrompt.tsx # User input capture
│ │ │ ├── StatusBar.tsx # Model, session info
│ │ │ └── ErrorDisplay.tsx # Error rendering
│ │ └── hooks/
│ │ ├── useAgent.ts # Connects UI to orchestrator
│ │ └── useEvents.ts # Event subscription hook
│ │
│ ├── core/
│ │ └── ... # (unchanged)
│ │
│ ├── conversation/
│ │ └── ... # (unchanged)
│ │
│ ├── tools/
│ │ └── ... # (unchanged)
│ │
│ ├── llm/
│ │ └── ... # (unchanged)
│ │
│ ├── events/
│ │ └── ... # (unchanged)
│ │
│ └── utils/
│ └── ... # (unchanged)

---

Updated UI Class Definitions

// src/cli/index.ts

/\*\*

- CLI
-
- Entry point for the command-line interface. Responsible for:
- - Parsing command-line arguments (--model, --config, etc.)
- - Loading configuration from files and environment
- - Creating the Session and Orchestrator instances
- - Rendering the Ink App component
- - Handling top-level signals (SIGINT for graceful shutdown)
    \*/
    class CLI {}

// src/cli/ui/App.tsx

/\*\*

- App
-
- Root Ink component. Responsible for:
- - Composing all UI components
- - Managing top-level UI state (mode: input/running/error)
- - Connecting to the orchestrator via useAgent hook
- - Handling keyboard shortcuts (Ctrl+C interrupt)
    \*/
    const App: FC<{ orchestrator: Orchestrator }> = () => {}

// src/cli/ui/components/AgentOutput.tsx

/\*\*

- AgentOutput
-
- Displays streaming agent responses. Responsible for:
- - Rendering text deltas as they arrive
- - Applying markdown-like formatting (code blocks, etc.)
- - Auto-scrolling to latest content
- - Handling long outputs gracefully
    \*/
    const AgentOutput: FC<{ text: string }> = () => {}

// src/cli/ui/components/ToolStatus.tsx

/\*\*

- ToolStatus
-
- Shows tool execution status. Responsible for:
- - Displaying spinner while tool is running
- - Showing tool name and arguments
- - Indicating success/failure on completion
- - Collapsing/expanding tool output
    \*/
    const ToolStatus: FC<{ toolCall: ToolCall; status: ToolState }> = () => {}

// src/cli/ui/components/InputPrompt.tsx

/\*\*

- InputPrompt
-
- Captures user input. Responsible for:
- - Rendering input field when agent is idle
- - Handling multi-line input (shift+enter)
- - Submitting on enter
- - Showing prompt indicator (> or custom)
    \*/
    const InputPrompt: FC<{ onSubmit: (text: string) => void }> = () => {}

// src/cli/ui/components/StatusBar.tsx

/\*\*

- StatusBar
-
- Shows session status information. Responsible for:
- - Displaying current model name
- - Showing token usage (input/output)
- - Indicating connection status
- - Showing working directory
    \*/
    const StatusBar: FC<{ session: Session }> = () => {}

// src/cli/ui/components/ErrorDisplay.tsx

/\*\*

- ErrorDisplay
-
- Renders errors. Responsible for:
- - Formatting error messages with context
- - Differentiating error types (tool error, API error, etc.)
- - Providing actionable hints when possible
    \*/
    const ErrorDisplay: FC<{ error: AgentError }> = () => {}

// src/cli/ui/hooks/useAgent.ts

/\*\*

- useAgent
-
- Hook connecting UI to the agent orchestrator. Responsible for:
- - Subscribing to orchestrator events
- - Exposing submit/interrupt methods
- - Managing UI state based on agent state
- - Cleaning up subscriptions on unmount
    \*/
    const useAgent = (orchestrator: Orchestrator) => {
    // Returns: { state, output, submit, interrupt }
    }

// src/cli/ui/hooks/useEvents.ts

/\*\*

- useEvents
-
- Hook for subscribing to typed events. Responsible for:
- - Subscribing to specific event types
- - Batching rapid events for render efficiency
- - Cleaning up listeners on unmount
    \*/
    const useEvents = <T extends EventType>(
    emitter: EventEmitter,
    eventType: T
    ) => {}

---

Dependencies

{
"dependencies": {
"ink": "^4.4.1",
"ink-spinner": "^5.0.0",
"ink-text-input": "^5.0.1",
"react": "^18.2.0",
"chalk": "^5.3.0",
"@anthropic-ai/sdk": "^0.24.0"
},
"devDependencies": {
"@types/react": "^18.2.0",
"typescript": "^5.4.0"
}
}

---

UI State Machine

┌─────────┐ user submits ┌─────────┐
│ IDLE │────────────────▶│ RUNNING │
│ │ │ │
│ [Input │ │ [Agent │
│ shown] │◀────────────────│ output │
└─────────┘ task complete │ stream]│
▲ └────┬────┘
│ │
│ ┌─────────┐ │
│ │ ERROR │◀─────────┘ on error
└──────│ │
dismissed └─────────┘

---
