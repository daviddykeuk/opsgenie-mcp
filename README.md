# OpsGenie MCP Server

A Model Context Protocol (MCP) server for interacting with OpsGenie alerts through AI assistants.

## What it does

This MCP server provides tools for AI assistants to:

- List all OpsGenie alerts
- List only open OpsGenie alerts
- Get details of a specific alert
- Add notes to existing alerts

It connects to the OpsGenie API and provides a structured interface for AI assistants to query your alerts.

## Prerequisites

- Node.js (v16+)
- npm
- An OpsGenie API key

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/opsgenie-mcp.git
cd opsgenie-mcp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the project

```bash
npm run build
```

## Usage

### 1. Set your OpsGenie API key

```bash
export OPSGENIE_API_KEY=your-api-key-here
export OPSGENIE_USER=your-username  # Optional: used to attribute notes to a specific user
```

### 2. Run the server

```bash
node build/index.js
```

### 3. Connect to the server

The server runs on stdio, which means it can be used directly by AI assistants that support MCP.

## Project Structure

The project follows a modular directory structure:

```
/src/
  ├── index.ts                  # Main entry point
  └── /tools/                   # All MCP tools
      ├── index.ts              # Tools export file
      ├── README.md             # Tools documentation
      ├── TEMPLATE.ts           # Template for new tools
      ├── /listAlerts/          # List all alerts tool
      ├── /listOpenAlerts/      # List open alerts tool
      ├── /getAlert/            # Get alert details tool
      └── /addNote/             # Add note to alert tool
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

## Extending with New Tools

To add new tools to this MCP server, follow the documentation in:

- `src/tools/README.md`: Guidelines for adding new tools
- `src/tools/TEMPLATE.ts`: Starter template for new tool implementations

These resources provide step-by-step instructions and best practices for extending the OpsGenie MCP server with additional functionality.

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