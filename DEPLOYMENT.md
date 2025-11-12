# SAP BTP Cloud Foundry Deployment Guide

This guide explains how to deploy the MCP Integration Suite server to SAP BTP Cloud Foundry.

## Prerequisites

1. SAP BTP account with Cloud Foundry space
2. Cloud Foundry CLI installed (`cf` command)
3. Node.js 18+ and npm 9+

## Configuration

### Environment Variables via HTTP Headers

The server supports passing environment variables through HTTP headers when deployed on Cloud Foundry. This allows you to configure the MCP client without exposing credentials in environment variables.

#### Supported Headers

- `x-api-oauth-client-id` - OAuth Client ID for API authentication
- `x-api-oauth-client-secret` - OAuth Client Secret for API authentication
- `x-api-oauth-token-url` - OAuth Token URL
- `x-api-base-url` - Base URL for the API
- `x-api-user` - Basic auth username (alternative to OAuth)
- `x-api-pass` - Basic auth password (alternative to OAuth)
- `x-cpi-base-url` - CPI Base URL
- `x-cpi-oauth-client-id` - CPI OAuth Client ID
- `x-cpi-oauth-client-secret` - CPI OAuth Client Secret
- `x-cpi-oauth-token-url` - CPI OAuth Token URL

### Example MCP Client Configuration

```json
{
  "mcpServers": {
    "integration-suite": {
      "url": "https://your-app.cfapps.eu10.hana.ondemand.com/mcp",
      "headers": {
        "x-api-oauth-client-id": "your-client-id",
        "x-api-oauth-client-secret": "your-client-secret",
        "x-api-oauth-token-url": "https://your-tenant.authentication.eu10.hana.ondemand.com/oauth/token",
        "x-api-base-url": "https://your-cpi.hana.ondemand.com/api/v1"
      }
    }
  }
}
```

## Deployment Steps

### 1. Login to Cloud Foundry

```bash
cf login -a https://api.cf.eu10.hana.ondemand.com
```

### 2. Target Your Org and Space

```bash
cf target -o your-org -s your-space
```

### 3. Build the Application

```bash
npm install
npm run build
```

### 4. Deploy to Cloud Foundry

```bash
cf push
```

This will use the `manifest.yml` file in the project root for deployment configuration.

### 5. Verify Deployment

Check the application status:

```bash
cf apps
```

Test the health endpoint:

```bash
curl https://your-app-name.cfapps.eu10.hana.ondemand.com/health
```

## Manifest Configuration

The `manifest.yml` file contains:

```yaml
---
applications:
  - name: mcp-integration-suite
    memory: 512M
    instances: 1
    buildpacks:
      - nodejs_buildpack
    command: node dist/server.js
    health-check-type: http
    health-check-http-endpoint: /health
    env:
      NODE_ENV: production
```

You can customize:
- `name` - Application name
- `memory` - Memory allocation
- `instances` - Number of instances

## Available Endpoints

- `GET /health` - Health check endpoint
- `POST /mcp` - MCP protocol endpoint (accepts headers for configuration)

## Local Development vs Cloud Foundry

### Local Development (stdio mode)

For local development with full MCP functionality:

```bash
npm run start:stdio
```

This runs the server in stdio mode for use with MCP clients like Claude Desktop.

### Cloud Foundry Deployment (HTTP mode)

For Cloud Foundry deployment:

```bash
npm start
```

This starts the HTTP server on port 8080 (or PORT environment variable).

## Troubleshooting

### Check Application Logs

```bash
cf logs mcp-integration-suite --recent
```

### SSH into Application

```bash
cf ssh mcp-integration-suite
```

### Restart Application

```bash
cf restart mcp-integration-suite
```

## Security Considerations

1. Always use HTTPS endpoints
2. Pass credentials via headers, not in URLs
3. Use OAuth authentication when possible
4. Rotate credentials regularly
5. Monitor access logs

## Updating the Application

1. Make your changes
2. Build: `npm run build`
3. Deploy: `cf push`

The application will be updated with zero downtime if multiple instances are running.
