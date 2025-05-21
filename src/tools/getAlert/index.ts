import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

export const registerTool = (server: McpServer) => {
    server.tool(
        "getAlert",
        "Get details of a specific Opsgenie alert",
        { identifier: z.string().min(1).describe("Alert identifier (ID or alias)") },
        async ({ identifier }) => {
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
          const url = `https://api.opsgenie.com/v2/alerts/${identifier}`;
          
          try {
            const response = await axios.get(url, {
              headers: {
                Authorization: `GenieKey ${apiKey}`,
              },
            });
            
            const data = response.data as { data: any };
            return {
              content: [{
                type: "text",
                text: JSON.stringify(data.data)
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