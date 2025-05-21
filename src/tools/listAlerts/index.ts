import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { opsgenieGet } from "../../utils/api.js";

interface OpsgenieAlertsResponse {
  data: any[];
}

export const registerTool = (server: McpServer) => {
  server.tool(
    "listAlerts",
    "List Opsgenie alerts",
    {
      limit: z.number().min(1).max(100).optional(),
      message: z.string().optional(),
    },
    async ({ limit, message }) => {
      try {
        const params: Record<string, string | number> = {
          query: message ? `message:${message}*` : "",
          sort: "lastOccurredAt",
          order: "desc"
        };
        
        if (limit) {
          params.limit = limit;
        }
        
        const response = await opsgenieGet<OpsgenieAlertsResponse>("/alerts", params);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data)
          }],
        };
      } catch (error: any) {
        return {
          structuredContent: {
            alerts: [],
          },
          isError: true,
          content: [
            {
              type: "text",
              text: `Error: ${error.response?.data?.message || error.message}`,
            },
          ],
        };
      }
    }
  );
};