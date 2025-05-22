import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { 
    registerListAlertsTool, 
    registerGetAlertTool, 
    registerListOpenAlertsTool,
    registerAddNoteTool,
    registerGetOnCallTool,
    registerGetNextOnCallTool,
    registerCreateOverrideTool
} from "./tools/index.js";

// Create server instance
const server = new McpServer({
  name: "opsgenie-mcp",
  version: "1.0.0"
});

registerListAlertsTool(server);
registerListOpenAlertsTool(server);
registerGetAlertTool(server);
registerAddNoteTool(server);
registerGetOnCallTool(server);
registerGetNextOnCallTool(server);
registerCreateOverrideTool(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.info("OpsGenie MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});