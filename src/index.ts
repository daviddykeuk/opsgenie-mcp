import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";

// Create server instance
const server = new McpServer({
  name: "opsgenie-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "listAlerts",
  "List Opsgenie alerts",
  { limit: z.number().min(1).max(100).optional() },
  async ({ limit }) => {
    const apiKey = process.env.OPSGENIE_API_KEY;
    if (!apiKey) {
      return {
        structuredContent: {
          alerts: [],
        },
        isError: true,
        content: [
          {
            type: "text",
            text: "Opsgenie API key is not set in the environment variable OPSGENIE_API_KEY.",
          },
        ],
      };
    }
    const url = "https://api.opsgenie.com/v2/alerts";
    const params = limit ? { limit } : {};
    const response = await axios.get(url, {
      headers: {
        Authorization: `GenieKey ${apiKey}`,
      },
      params,
    });
    const data = response.data as { data: any[] };
    return {
      content: [{
        type: "text",
        text: JSON.stringify(data.data)
      }],
    };
  }
);

server.tool(
  "listOpenAlerts",
  "List open Opsgenie alerts",
  { limit: z.number().min(1).max(100).optional() },
  async ({ limit }) => {
    const apiKey = process.env.OPSGENIE_API_KEY;
    if (!apiKey) {
      return {
        structuredContent: {
          alerts: [],
        },
        isError: true,
        content: [
          {
            type: "text",
            text: "Opsgenie API key is not set in the environment variable OPSGENIE_API_KEY.",
          },
        ],
      };
    }
    const url = "https://api.opsgenie.com/v2/alerts";
    const params = { 
      query: "status:open",
      ...(limit ? { limit } : {})
    };
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `GenieKey ${apiKey}`,
      },
      params,
    });
    
    const data = response.data as { data: any[] };
    return {
      content: [{
        type: "text",
        text: JSON.stringify(data.data)
      }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("OpsGenie MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});