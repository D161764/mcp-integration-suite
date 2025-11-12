# Cloud Foundry Quick Start Guide

## Prerequisites
- CF CLI installed
- SAP BTP account with Cloud Foundry access
- Node.js 18+ and npm 9+

## Quick Deployment

```bash
# 1. Login to Cloud Foundry
cf login -a https://api.cf.eu10.hana.ondemand.com

# 2. Target your org and space
cf target -o <your-org> -s <your-space>

# 3. Deploy
cf push
```

The deployment will automatically:
- Install dependencies
- Build the application
- Start the HTTP server
- Configure health checks

## Verify Deployment

```bash
# Check app status
cf apps

# View logs
cf logs mcp-integration-suite --recent

# Test health endpoint
curl https://<your-app-route>/health
```

## MCP Client Configuration

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "integration-suite": {
      "url": "https://<your-app-route>/mcp",
      "headers": {
        "x-api-oauth-client-id": "your-client-id",
        "x-api-oauth-client-secret": "your-client-secret",
        "x-api-oauth-token-url": "https://<tenant>.authentication.eu10.hana.ondemand.com/oauth/token",
        "x-api-base-url": "https://<cpi-uri>.hana.ondemand.com/api/v1"
      }
    }
  }
}
```

## Configuration Headers

All credentials are passed via HTTP headers:

| Header | Description |
|--------|-------------|
| `x-api-oauth-client-id` | OAuth Client ID |
| `x-api-oauth-client-secret` | OAuth Client Secret |
| `x-api-oauth-token-url` | OAuth Token endpoint |
| `x-api-base-url` | API base URL |
| `x-api-user` | Basic auth username (alternative) |
| `x-api-pass` | Basic auth password (alternative) |
| `x-cpi-base-url` | CPI base URL |
| `x-cpi-oauth-client-id` | CPI OAuth Client ID |
| `x-cpi-oauth-client-secret` | CPI OAuth Client Secret |
| `x-cpi-oauth-token-url` | CPI OAuth Token URL |

## Local Development

For local development with full MCP stdio support:

```bash
# Create .env file from example
cp .env.example .env

# Edit .env with your credentials
nano .env

# Run in stdio mode
npm run start:stdio
```

## Troubleshooting

### App won't start
```bash
cf logs mcp-integration-suite --recent
```

### Update deployment
```bash
npm run build
cf push
```

### Scale instances
```bash
cf scale mcp-integration-suite -i 2
```

## Support

For detailed information, see:
- `DEPLOYMENT.md` - Full deployment guide
- `CHANGES.md` - List of all changes
- `.env.cf.example` - Environment variable reference
