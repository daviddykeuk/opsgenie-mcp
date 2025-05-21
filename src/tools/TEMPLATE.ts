/**
 * TEMPLATE for creating new OpsGenie MCP tools
 * Copy this file to your new tool directory as index.ts
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { opsgenieGet, opsgeniePost } from "../utils/api.js";

interface OpsgenieResponse {
  data: any; // Replace with your specific response structure
}

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
      try {
        // For GET requests
        // const params: Record<string, string | number> = {};
        // if (paramName2) {
        //   params.someParam = paramName2;
        // }
        // const response = await opsgenieGet<OpsgenieResponse>("/endpoint-path", params);
        
        // For POST requests
        const requestBody = {
          key1: paramName1,
          // Add more fields as needed
        };
        
        const response = await opsgeniePost<OpsgenieResponse>(
          "/endpoint-path",
          requestBody
        );
        
        // Return success response
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data)
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