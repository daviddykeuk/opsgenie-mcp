import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { opsgeniePost } from "../../utils/api.js";

interface OpsgenieNoteResponse {
  result: string;
  took: number;
  requestId: string;
}

export const registerTool = (server: McpServer) => {
  server.tool(
    "addNote",
    "Add a note to an existing Opsgenie alert",
    {
      identifier: z.string().describe("Alert identifier (ID or alias)"),
      note: z.string().max(25000).describe("Content of the note"),
    },
    async ({ identifier, note }) => {
      try {
        // Get user from environment variable if set
        const user = process.env.OPSGENIE_USER;
        
        // Prepare request body
        const requestBody: Record<string, string> = { note };
        if (user) {
          requestBody.user = user;
        }

        // Make API request to OpsGenie
        const response = await opsgeniePost<OpsgenieNoteResponse>(
          `/alerts/${encodeURIComponent(identifier)}/notes`,
          requestBody
        );
        
        // Return success response
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response)
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