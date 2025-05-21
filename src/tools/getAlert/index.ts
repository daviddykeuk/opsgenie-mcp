import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { opsgenieGet } from "../../utils/api.js";

interface OpsgenieAlertResponse {
  data: any;
}

export const registerTool = (server: McpServer) => {
    server.tool(
        "getAlert",
        "Get details of a specific Opsgenie alert",
        { identifier: z.string().min(1).describe("Alert identifier (ID or alias)") },
        async ({ identifier }) => {
          try {
            const response = await opsgenieGet<OpsgenieAlertResponse>(`/alerts/${identifier}`);
            
            return {
              content: [{
                type: "text",
                text: JSON.stringify(response.data)
              }],
            };
          } catch (error: any) {
            return {
              isError: true,
              content: [
                {
                  type: "text",
                  text: `Error fetching alert: ${error.response?.data?.message || error.message}`,
                },
              ],
            };
          }
        }
      );   
};