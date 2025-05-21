import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

interface OpsgenieNextOnCallResponse {
  data: any;
}

export const registerTool = (server: McpServer) => {
  server.tool(
    "getNextOnCall",
    "Get next on-call participants from Opsgenie schedules",
    {
      scheduleIdentifier: z.string().optional().describe("Identifier of the schedule (optional)"),
    },
    async ({ scheduleIdentifier }) => {
      const apiKey = process.env.OPSGENIE_API_KEY;
      if (!apiKey) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: "Opsgenie API key is not set in the environment variable OPSGENIE_API_KEY.",
            },
          ],
        };
      }

      try {
        // We need a schedule identifier for the next-on-calls endpoint
        if (!scheduleIdentifier) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: "A schedule identifier is required for getting next on-call participants.",
              },
            ],
          };
        }

        // Construct the URL for next-on-calls
        const url = `https://api.opsgenie.com/v2/schedules/${scheduleIdentifier}/next-on-calls`;
        const params: Record<string, string> = { 
          flat: "false",
          scheduleIdentifierType: "name"
        };
        
        const response = await axios.get<OpsgenieNextOnCallResponse>(url, {
          headers: {
            Authorization: `GenieKey ${apiKey}`,
          },
          params,
        });

        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data.data)
          }],
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