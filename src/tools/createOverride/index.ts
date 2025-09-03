import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { opsgeniePost } from "../../utils/api.js";

interface OpsgenieOverrideResponse {
  data: {
    alias: string;
  };
  took: number;
  requestId: string;
}

export const registerTool = (server: McpServer) => {
  server.tool(
    "createOverride",
    "Create a schedule override to take on-call responsibility for a period of time",
    {
      scheduleIdentifier: z.string().optional().describe("Name of the schedule to override (uses OPSGENIE_SCHEDULE environment variable if not provided)"),
      startDate: z.string().describe("Start time for the override in ISO format (e.g. 2023-05-22T12:00:00Z)"),
      endDate: z.string().describe("End time for the override in ISO format (e.g. 2023-05-22T13:00:00Z)")
    },
    async ({ scheduleIdentifier, startDate, endDate }) => {
      try {
        // Get user email from environment variable
        const userEmail = process.env.OPSGENIE_USER_EMAIL;
        if (!userEmail) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: "User email is not set in the environment variable OPSGENIE_USER_EMAIL.",
              },
            ],
          };
        }

        // Get schedule from parameter or environment variable
        const schedule = scheduleIdentifier || process.env.OPSGENIE_SCHEDULE;
        if (!schedule) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: "Schedule identifier is not provided and OPSGENIE_SCHEDULE environment variable is not set.",
              },
            ],
          };
        }

        // Create the request body
        const requestBody = {
          user: {
            type: "user",
            username: userEmail
          },
          startDate,
          endDate
        };
        
        // Make the API request - hard-coded to use "name" as the identifier type
        const response = await opsgeniePost<OpsgenieOverrideResponse>(
          `/schedules/${encodeURIComponent(schedule)}/overrides?scheduleIdentifierType=name`,
          requestBody
        );
        
        // Return success response
        return {
          content: [{
            type: "text",
            text: `Successfully created override for schedule "${schedule}" with alias: ${response.data.alias}`
          }],
        };
      } catch (error: any) {
        // Return error response
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Error creating schedule override: ${error.response?.data?.message || error.message}`,
            },
          ],
        };
      }
    }
  );
}; 