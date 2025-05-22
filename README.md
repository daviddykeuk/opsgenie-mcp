# OpsGenie MCP Server

A Model Context Protocol (MCP) server for interacting with OpsGenie alerts through AI assistants.

## What it does

This MCP server provides tools for AI assistants to:

- List all OpsGenie alerts
- List only open OpsGenie alerts
- Get details of a specific alert
- Add notes to existing alerts
- Check who is currently on-call
- Check who is next on-call

It connects to the OpsGenie API and provides a structured interface for AI assistants to query your alerts.

## Prerequisites

- Node.js (v16+)
- npm
- An OpsGenie API key

## Usage

#### 1. Clone the repository

```bash
git clone https://github.com/daviddykeuk/opsgenie-mcp.git
cd opsgenie-mcp
```

#### 2. Install dependencies

```bash
npm install
```

### 3. Add the server to your client
```json
{
  "mcpServers": {
    // ... existing servers in here
    "opsgenie": {
      "command": "node",
      "args": [
          "/path/to/cloned/opsgenie-mcp/build/index.js"
      ],
      "env": {
        "OPSGENIE_API_KEY": "xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxx",
        "OPSGENIE_USER": "John Tracy",  // Optional for addNote tool
        "OPSGENIE_USER_EMAIL": "john@internationalresuce.com",  // Required for createOverride tool
        "OPSGENIE_SCHEDULE": "International Rescue on-call"  // Optional: Default schedule name for on-call tools
      }
    }
  }
}
```


## Project Structure

The project follows a modular directory structure:

```
/src/
  ├── index.ts                  # Main entry point
  └── /tools/                   # All MCP tools
      ├── index.ts              # Tools export file
      ├── README.md             # Tools documentation
      ├── /templates/           # Template for new tools
      ├── /listAlerts/          # List all alerts tool
      ├── /listOpenAlerts/      # List open alerts tool
      ├── /getAlert/            # Get alert details tool
      ├── /addNote/             # Add note to alert tool
      ├── /getOnCall/           # Get current on-call participants tool
      └── /getNextOnCall/       # Get next on-call participants tool
```

Each tool is contained in its own directory, making the codebase more maintainable and easier to navigate.

## Available Tools

### `listAlerts`

Lists all alerts from OpsGenie.

Parameters:
- `limit` (optional): Number of alerts to return (max 100)

### `listOpenAlerts`

Lists only alerts with status "open".

Parameters:
- `limit` (optional): Number of open alerts to return (max 100)

### `getAlert`

Get details of a specific alert.

Parameters:
- `identifier` (required): Alert identifier (ID or alias)

### `addNote`

Add a note to an existing alert.

Parameters:
- `identifier` (required): Alert identifier (ID or alias)
- `note` (required): Content of the note (max 25000 characters)

Environment Variables:
- `OPSGENIE_USER` (optional): Username to be recorded as the note author

### `getOnCall`

Get current on-call participants from a specific schedule.

Parameters:
- `scheduleIdentifier` (optional): Name of the schedule to get on-call participants for. If not provided, uses OPSGENIE_SCHEDULE environment variable or gets all schedules.

### `getNextOnCall`

Get next on-call participants from a specific schedule.

Parameters:
- `scheduleIdentifier` (optional): Name of the schedule to get next on-call participants for. If not provided, uses OPSGENIE_SCHEDULE environment variable.

### `createOverride`

Create a schedule override to take on-call responsibility for a period of time.

Parameters:
- `scheduleIdentifier` (optional): Name of the schedule to override. If not provided, uses OPSGENIE_SCHEDULE environment variable.
- `startDate` (required): Start time for the override in ISO format (e.g. 2023-05-22T12:00:00Z)
- `endDate` (required): End time for the override in ISO format (e.g. 2023-05-22T13:00:00Z)

Environment Variables:
- `OPSGENIE_USER_EMAIL` (required): Email address of the user taking on-call responsibility
- `OPSGENIE_SCHEDULE` (optional): Default schedule name to use if scheduleIdentifier is not provided

## Extending with New Tools

To add new tools to this MCP server, follow the documentation in:

- `src/tools/README.md`: Guidelines for adding new tools
- `src/tools/TEMPLATE.ts`: Starter template for new tool implementations

These resources provide step-by-step instructions and best practices for extending the OpsGenie MCP server with additional functionality.

## Creating Releases

This project uses GitHub Actions to automate the release process, including version bumping, tagging, creating a GitHub release, and publishing to npm.

To create a new release:

1. Go to the GitHub repository
2. Navigate to the "Actions" tab
3. Select the "Create Release and Publish" workflow
4. Click "Run workflow"
5. Choose the release type:
   - `patch` for bug fixes (1.0.0 → 1.0.1)
   - `minor` for new features (1.0.0 → 1.1.0)
   - `major` for breaking changes (1.0.0 → 2.0.0)
6. Click "Run workflow" to start the process

The workflow will:
- Update the version in package.json
- Create a new git tag
- Generate a GitHub release with release notes
- Publish the package to npm

### Required Secrets

For the workflow to function properly, you need to add an NPM_TOKEN secret to your GitHub repository:

1. Generate an npm access token with publish permissions
2. Go to your GitHub repository → Settings → Secrets → New repository secret
3. Name: `NPM_TOKEN`
4. Value: your npm access token

## Note on OpsGenie Sunsetting

Atlassian has announced plans to sunset OpsGenie by 2027, migrating customers to Jira Service Management. While OpsGenie will eventually be deprecated, this project serves as a useful learning example for building MCP servers that can interact with REST APIs.

## Learning MCP Development

This project demonstrates:

1. Setting up an MCP server with Node.js
2. Defining tool schemas and handlers
3. Making authenticated API requests
4. Handling and transforming API responses
5. Returning structured data to AI assistants

Feel free to use this as a template for building MCP servers for other services.

## License

MIT 