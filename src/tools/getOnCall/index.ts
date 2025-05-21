import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { opsgenieGet, createErrorResponse, createSuccessResponse } from "../../utils/api.js";

interface OpsgenieOnCallResponse {
  data: any;
}

export const registerTool = (server: McpServer) => {
  server.tool(
    "getOnCall",
    "Get current on-call participants from Opsgenie schedules",
    {
      scheduleIdentifier: z.string().optional().describe("Identifier of the schedule (optional)"),
    },
    async ({ scheduleIdentifier }) => {
      try {
        // Construct the endpoint based on whether a schedule identifier is provided
        let endpoint = "/schedules/on-calls";
        let params: Record<string, string> = { flat: "false" };
        
        // If a specific schedule identifier is provided
        if (scheduleIdentifier) {
          endpoint = `/schedules/${scheduleIdentifier}/on-calls`;
          params = {
            ...params,
            scheduleIdentifierType: "name",
          };
        }

        const response = await opsgenieGet<OpsgenieOnCallResponse>(endpoint, params);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data)
          }]
        };
      } catch (error: any) {
        return {
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