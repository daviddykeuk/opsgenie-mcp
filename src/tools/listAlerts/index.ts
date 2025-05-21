import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

export const registerTool = (server: McpServer) => {
  server.tool(
    "listAlerts",
    "List Opsgenie alerts",
    {
      limit: z.number().min(1).max(100).optional(),
      message: z.string().optional(),
    },
    async ({ limit, message }) => {
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
        query: message ? `message:${message}*` : "",
        sort: "lastOccurredAt",
        order: "desc",
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
};