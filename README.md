# Generative UI MCP

An MCP server that teaches AI models to generate interactive visualizations — charts, diagrams, mockups, and more.

> Inspired by [Anthropic's Artifacts](https://www.anthropic.com/news/artifacts) and [Vercel's Generative UI](https://vercel.com/blog/ai-sdk-3-generative-ui). This server provides structured design guidelines so AI models produce consistent, streaming-safe, visually polished widgets.

## What it does

Instead of stuffing thousands of tokens of design rules into every system prompt, this MCP server lets the model **load guidelines on demand** — only when it actually needs to generate a visualization.

| Module | What it covers |
|--------|---------------|
| `interactive` | HTML controls, forms, sliders, calculators |
| `chart` | Chart.js patterns, canvas setup, interactive data controls |
| `mockup` | UI mockup layouts, component patterns |
| `art` | SVG illustrations, artistic visualizations |
| `diagram` | Flowcharts, timelines, hierarchies, cycle diagrams, matrices |

The model calls `load_ui_guidelines` with the modules it needs, and gets back comprehensive design specs including:
- Core design system (philosophy, streaming rules, CSS variables)
- Color palette (6 ramps with semantic usage rules)
- Component patterns and code templates
- SVG setup guides with arrow markers and viewBox calculations
- 8 diagram types with layout rules and code examples

## Quick start

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "generative-ui": {
      "command": "node",
      "args": ["/path/to/Generative-UI-MCP/build/index.js"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add generative-ui node /path/to/Generative-UI-MCP/build/index.js
```

### npx (after publishing to npm)

```json
{
  "mcpServers": {
    "generative-ui": {
      "command": "npx",
      "args": ["generative-ui-mcp"]
    }
  }
}
```

## Tool

### `load_ui_guidelines`

Load detailed design guidelines for generating visual widgets.

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `modules` | `string[]` | Modules to load: `interactive`, `chart`, `mockup`, `art`, `diagram` |

**Example call:**

```json
{
  "name": "load_ui_guidelines",
  "arguments": {
    "modules": ["chart", "diagram"]
  }
}
```

Shared sections (like Core Design System and Color Palette) are automatically deduplicated when loading multiple modules.

## Resource

### `generative-ui://system-prompt`

A compact system prompt snippet (~300 tokens) with all hard constraints needed for valid widget output. Hosts can inject this into their system prompt so the model can generate basic widgets even without calling the tool.

Contains: output format, JSON escaping rules, streaming order, CDN allowlist, SVG setup, size limits, and interaction patterns.

## How it works

```
┌─────────────┐    system prompt     ┌─────────────┐
│   AI Host   │ ◄── injects ──────── │  Resource:   │
│ (Claude,    │     ~300 tokens      │ system-prompt│
│  Cursor,    │                      └─────────────┘
│  etc.)      │
│             │    tool call          ┌─────────────┐
│   Model ────│──► load_ui_          │  Guidelines  │
│             │    guidelines         │  Modules     │
│             │ ◄── returns ──────── │  (on demand) │
│             │    detailed specs     └─────────────┘
└─────────────┘
```

**Token savings:** The system prompt is ~300 tokens vs ~650+ tokens for full guidelines. Detailed specs are only loaded when the model actually needs to generate a visualization. Most conversations don't involve widgets, so this saves tokens on every request.

## Development

```bash
npm install
npm run build
npm start
```

## License

MIT
