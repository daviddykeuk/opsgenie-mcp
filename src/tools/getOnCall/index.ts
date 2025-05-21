import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

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
        // Construct the URL based on whether a schedule identifier is provided
        let url = "https://api.opsgenie.com/v2/schedules/on-calls";
        let params: Record<string, string> = { flat: "false" };
        
        // If a specific schedule identifier is provided
        if (scheduleIdentifier) {
          url = `https://api.opsgenie.com/v2/schedules/${scheduleIdentifier}/on-calls`;
          params = {
            ...params,
            scheduleIdentifierType: "name",
          };
        }

        const response = await axios.get<OpsgenieOnCallResponse>(url, {
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