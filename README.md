# CLI Agent

A terminal-based AI agent built with [Ink](https://github.com/vadimdemedes/ink) (React for CLIs) and the Anthropic SDK. Features streaming responses, built-in tools, and a reactive UI.

## Prerequisites

- Node.js 18+
- An Anthropic API key

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set your API key**

   ```bash
   export ANTHROPIC_API_KEY=your-api-key
   ```

3. **Run the agent**

   ```bash
   # Development mode (with hot reload)
   npm run dev

   # Or build and run
   npm run build
   npm start
   ```

## Built-in Tools

The agent comes with three built-in tools:

- **read_file** - Read contents of a file
- **write_file** - Write content to a file
- **run_shell** - Execute shell commands

## Project Structure

```
src/
├── index.ts              # Entry point
├── types.ts              # Shared type definitions
├── cli/                  # CLI bootstrap and UI
│   ├── index.ts          # CLI entry, arg parsing
│   └── ui/               # Ink components and hooks
├── core/                 # Orchestrator and session
├── conversation/         # Message history management
├── tools/                # Tool registry and built-ins
├── llm/                  # Anthropic SDK wrapper
├── events/               # Typed event emitter
└── utils/                # Helper functions
```

## Scripts

| Command          | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Run with tsx (development)     |
| `npm run build`  | Compile TypeScript             |
| `npm start`      | Run compiled code              |
