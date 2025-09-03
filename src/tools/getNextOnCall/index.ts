import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { opsgenieGet } from "../../utils/api.js";

interface OpsgenieNextOnCallResponse {
  data: any;
}

export const registerTool = (server: McpServer) => {
  server.tool(
    "getNextOnCall",
    "Get next on-call participants from Opsgenie schedules",
    {
      scheduleIdentifier: z.string().optional().describe("Identifier of the schedule (uses OPSGENIE_SCHEDULE environment variable if not provided)"),
    },
    async ({ scheduleIdentifier }) => {
      try {
        // Use the provided identifier or the environment variable
        const schedule = scheduleIdentifier || process.env.OPSGENIE_SCHEDULE;
        
        // We need a schedule identifier for the next-on-calls endpoint
        if (!schedule) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: "A schedule identifier is required for getting next on-call participants. Either provide one as a parameter or set the OPSGENIE_SCHEDULE environment variable.",
              },
            ],
          };
        }

        // Construct the endpoint for next-on-calls
        const endpoint = `/schedules/${schedule}/next-on-calls`;
        const params: Record<string, string> = { 
          flat: "false",
          scheduleIdentifierType: "name"
        };
        
        const response = await opsgenieGet<OpsgenieNextOnCallResponse>(endpoint, params);
        
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