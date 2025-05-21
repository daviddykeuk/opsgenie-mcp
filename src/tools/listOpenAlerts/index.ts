import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

export const registerTool = (server: McpServer) => {
    server.tool(
        "listOpenAlerts",
        "List open Opsgenie alerts in descending order of when they last occurred, use the message parameter to filter by message. The string will only match if it the start of the message or the string appears after a space (this is an OpsGenie limitation).",
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
            query: `status: open${message ? ` message: ${message}*` : ""}`,
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