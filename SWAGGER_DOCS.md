# SAP Integration Suite MCP Server - API Documentation

## Overview

This MCP server now includes comprehensive Swagger/OpenAPI documentation that is automatically generated from the registered tools.

## Accessing Documentation

### When Running Locally

```bash
npm start
# or
node dist/server.js
```

Visit: http://localhost:8080/

The root URL automatically redirects to the Swagger UI at http://localhost:8080/api-docs

### When Deployed to Cloud Foundry

Visit your deployed application URL:
- `https://your-app.cfapps.eu10.hana.ondemand.com/`
- This will automatically redirect to `/api-docs`

## What's Included in the Documentation

The Swagger documentation provides:

1. **Complete API Reference**
   - All available MCP tools with descriptions
   - Input schemas for each tool
   - Response formats

2. **Configuration Instructions**
   - Claude Desktop configuration examples
   - Other MCP client configuration
   - Header-based authentication setup

3. **Interactive API Testing**
   - Try out tools directly from the browser
   - See request/response examples
   - Test authentication headers

4. **MCP Protocol Details**
   - JSON-RPC 2.0 endpoint documentation
   - Available methods: `initialize`, `tools/list`, `tools/call`, `resources/list`
   - Authentication header requirements

## Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Redirects to API documentation |
| `/api-docs` | GET | Swagger UI interface |
| `/health` | GET | Health check endpoint |
| `/mcp` | POST | MCP protocol endpoint (JSON-RPC 2.0) |

## Authentication Headers

The documentation includes details on all supported authentication headers:

### OAuth Authentication (Recommended)
- `x-api-oauth-client-id`
- `x-api-oauth-client-secret`
- `x-api-oauth-token-url`
- `x-api-base-url`
- `x-cpi-base-url`
- `x-cpi-oauth-client-id`
- `x-cpi-oauth-client-secret`
- `x-cpi-oauth-token-url`

### Basic Authentication (Alternative)
- `x-api-user`
- `x-api-pass`
- `x-api-base-url`
- `x-cpi-base-url`

## Configuration Examples

The documentation includes ready-to-use configuration examples for:

1. **Claude Desktop** - Complete `claude_desktop_config.json` configuration
2. **Command Line** - `npx mcp-remote` command examples
3. **Other MCP Clients** - Generic configuration patterns

## Development

### Regenerating Documentation

The Swagger specification is automatically generated when the server starts based on:
- Registered MCP tools
- Tool descriptions and input schemas
- Current environment variables (for URLs)

No manual updates needed - documentation stays in sync with your code!

### Customization

To customize the documentation, edit:
- `src/utils/swagger.ts` - Main Swagger spec generator
- Update tool descriptions in your handler files

## Features

- **Auto-generated from code** - Documentation is always up-to-date
- **Interactive testing** - Try tools directly from the browser
- **Copy-paste ready configs** - All configuration examples are ready to use
- **Responsive design** - Works on desktop and mobile
- **No authentication required** - Documentation is publicly accessible

## Example: Using the Documentation

1. **Deploy your server** to Cloud Foundry
2. **Share the URL** with your team: `https://your-app.cfapps.eu10.hana.ondemand.com/`
3. **Team members can:**
   - Browse available tools
   - Copy Claude Desktop configuration
   - Test the API directly
   - Understand authentication requirements

## Screenshot Features

When you visit the documentation, you'll see:

- Comprehensive overview and introduction
- List of all available tools with descriptions
- Configuration examples for Claude Desktop
- Interactive API explorer
- Authentication details
- Request/response schemas
- Health check endpoint
- MCP protocol documentation

## Next Steps

1. Deploy your server: `cf push`
2. Visit your application URL
3. Share the documentation with your team
4. Start using the MCP tools in Claude Desktop!
