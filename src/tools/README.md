# OpsGenie MCP Tools

This directory contains tools that allow AI assistants to interact with OpsGenie through the Model Context Protocol (MCP).

## Directory Structure

The tools are organized into a modular directory structure:

```
/src/tools/
  ├── index.ts             # Main export file
  ├── README.md            # This documentation
  ├── TEMPLATE.ts          # Template for creating new tools
  ├── /listAlerts/         # List all alerts tool
  │   └── index.ts
  ├── /listOpenAlerts/     # List open alerts tool
  │   └── index.ts  
  ├── /getAlert/           # Get alert details tool
  │   └── index.ts
  ├── /addNote/            # Add note to alert tool
  │   └── index.ts
  ├── /getOnCall/          # Get current on-call participants tool
  │   └── index.ts
  └── /getNextOnCall/      # Get next on-call participants tool
      └── index.ts
  └── /createOverride/     # Create on-call override tool
      └── index.ts
```

## Available Tools

- `listAlerts`: List all alerts from OpsGenie
- `listOpenAlerts`: List open alerts from OpsGenie, sorted by when they last occurred
- `getAlert`: Get detailed information about a specific alert
- `addNote`: Add a note to an existing alert (uses OPSGENIE_USER environment variable if set)
- `getOnCall`: Get current on-call participants from OpsGenie schedules (uses OPSGENIE_SCHEDULE environment variable if no schedule is specified)
- `getNextOnCall`: Get next on-call participants from OpsGenie schedules (uses OPSGENIE_SCHEDULE environment variable if no schedule is specified)
- `createOverride`: Create a schedule override to take on-call responsibility for a period of time (uses OPSGENIE_SCHEDULE and OPSGENIE_USER_EMAIL environment variables)

## Environment Variables

The following environment variables can be used with these tools:

- `OPSGENIE_API_KEY`: (Required) Your OpsGenie API key
- `OPSGENIE_USER`: (Optional) Username to be recorded as the note author for the `addNote` tool
- `OPSGENIE_USER_EMAIL`: (Required for `createOverride`) Email address of the user taking on-call responsibility
- `OPSGENIE_SCHEDULE`: (Optional) Default schedule name to use for on-call related tools

## Adding a New Tool

Follow these steps to add a new tool to this MCP server:

### 1. Create a New Tool Directory

Create a new directory in the `src/tools` directory. Name it according to its functionality:

```bash
mkdir -p src/tools/yourNewTool
```

### 2. Create an index.ts File

Create an `index.ts` file in your new tool directory using the TEMPLATE.ts as a reference:

```typescript
// src/tools/yourNewTool/index.ts

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { opsgenieGet, opsgeniePost } from "../../utils/api.js";

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
```

### 3. Export Tool from index.ts

Add an export entry in the main `src/tools/index.ts` file:

```typescript
export { registerTool as registerYourNewToolTool } from "./yourNewTool/index.js";
```

### 4. Register Tool in main server file

Add registration in `src/index.ts`:

```typescript
import { registerYourNewToolTool } from "./tools/index.js";

// ... existing code ...

registerYourNewToolTool(server);
```

### 5. Update Main README

Update the main README.md file with information about your new tool:

```markdown
### `yourNewTool`

Brief description of what your tool does.

Parameters:
- `paramName1`: Description of parameter
- `paramName2` (optional): Description of optional parameter
```

## Best Practices

1. **Error Handling**: Always handle API errors and provide meaningful error messages
2. **Parameter Validation**: Use Zod to validate parameters and provide helpful descriptions
3. **Documentation**: Update both this README and the main project README when adding new tools
4. **Consistent Naming**: Follow the established naming conventions for tool registration
5. **Modular Structure**: Keep each tool in its own directory for better organization