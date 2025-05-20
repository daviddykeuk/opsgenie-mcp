import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

// Create server instance
const server = new McpServer({
  name: "opsgenie-mcp",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});


async function main() {
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Weather MCP Server running on stdio");
}

main().catch((error) => {
console.error("Fatal error in main():", error);
process.exit(1);
});