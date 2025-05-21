import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import axios from "axios";

export const registerTool = (server: McpServer) => {
  server.tool(
    "addNote",
    "Add a note to an existing Opsgenie alert",
    {
      identifier: z.string().describe("Alert identifier (ID or alias)"),
      note: z.string().max(25000).describe("Content of the note"),
    },
    async ({ identifier, note }) => {
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

      // Get user from environment variable if set
      const user = process.env.OPSGENIE_USER;
      
      // Create URL 
      const url = `https://api.opsgenie.com/v2/alerts/${encodeURIComponent(identifier)}/notes`;
      
      // Prepare request body
      const requestBody: Record<string, string> = { note };
      if (user) {
        requestBody.user = user;
      }

      // Implement API call logic
      try {
        // Make API request to OpsGenie
        const response = await axios.post(
          url,
          requestBody,
          {
            headers: {
              Authorization: `GenieKey ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Type the response data
        const responseData = response.data as { result: string, took: number, requestId: string };
        
        // Return success response
        return {
          content: [{
            type: "text",
            text: JSON.stringify(responseData)
          }],
        };
      } catch (error: any) {
        // Return error response
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error adding note to alert: ${error.response?.data?.message || error.message}`,
            },
          ],
        };
      }
    }
  );
}; 