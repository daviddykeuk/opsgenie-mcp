/**
 * TEMPLATE for creating new OpsGenie MCP tools
 * Copy this file to your new tool directory as index.ts
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

export const registerTool = (server: McpServer) => {
  server.tool(
    "toolName", // Unique tool name
    "Human-readable description of what the tool does", // Description
    {
      // Define parameters using Zod schema
      paramName1: z.string().describe("Parameter description"),
      paramName2: z.number().min(1).max(100).optional().describe("Optional parameter description"),
    },
    async ({ paramName1, paramName2 }) => {
      // Get API key
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

      // Implement API call logic
      try {
        // Make API request to OpsGenie
        const response = await axios.post(
          "https://api.opsgenie.com/v2/your-endpoint",
          { /* request data */ },
          {
            headers: {
              Authorization: `GenieKey ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Type the response data
        const responseData = response.data as { data: any };
        
        // Return success response
        return {
          content: [{
            type: "text",
            text: JSON.stringify(responseData.data)
          }],
        };
      } catch (error: any) {
        // Return error response
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