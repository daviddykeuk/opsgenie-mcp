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
  └── /addNote/            # Add note to alert tool
      └── index.ts
```

## Available Tools

- `listAlerts`: List all alerts from OpsGenie
- `listOpenAlerts`: List open alerts from OpsGenie, sorted by when they last occurred
- `getAlert`: Get detailed information about a specific alert
- `addNote`: Add a note to an existing alert (uses OPSGENIE_USER environment variable if set)

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
        // Make API request
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

        // Return success response
        return {
          content: [{
            type: "text",
            text: JSON.stringify(response.data.data)
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