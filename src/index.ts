#!/usr/bin/env node

/**
 * Generative UI MCP Server
 *
 * Teaches AI models to generate interactive visualizations (charts, diagrams,
 * mockups, SVG art) by providing on-demand design guidelines via the Model
 * Context Protocol.
 *
 * Tool: load_ui_guidelines
 *   - Loads detailed design specs for requested visualization modules
 *   - Modules: interactive, chart, mockup, art, diagram
 *   - Deduplicates shared sections across modules
 *
 * Resource: generative-ui://system-prompt
 *   - Provides a compact system prompt snippet with core widget rules
 *   - Hosts can inject this into their system prompt for baseline compliance
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getGuidelines, AVAILABLE_MODULES, SYSTEM_PROMPT } from "./guidelines.js";

const server = new McpServer({
  name: "generative-ui-mcp",
  version: "1.0.0",
});

// ── Tool: load_ui_guidelines ────────────────────────────────────────────────

server.tool(
  "load_ui_guidelines",
  `Load detailed design guidelines for generating visual widgets. Call this before generating your first widget in a conversation. Available modules: ${AVAILABLE_MODULES.join(", ")}.`,
  {
    modules: z
      .array(z.enum(["interactive", "chart", "mockup", "art", "diagram"]))
      .describe(
        "Which guideline modules to load. interactive = HTML controls/forms, chart = Chart.js, mockup = UI mockups, art = SVG illustrations, diagram = flowcharts/timelines/hierarchies."
      ),
  },
  async ({ modules }) => ({
    content: [{ type: "text", text: getGuidelines(modules) }],
  })
);

// ── Resource: system prompt snippet ─────────────────────────────────────────

server.resource(
  "system-prompt",
  "generative-ui://system-prompt",
  { mimeType: "text/plain", description: "Compact system prompt with core widget rules. Inject into your system prompt for baseline compliance." },
  async () => ({
    contents: [
      {
        uri: "generative-ui://system-prompt",
        mimeType: "text/plain",
        text: SYSTEM_PROMPT,
      },
    ],
  })
);

// ── Start server ────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Generative UI MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
