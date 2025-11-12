# Quick Deployment Guide

## Deploy to Cloud Foundry

```bash
# Build the project
npm run build

# Login to Cloud Foundry
cf login

# Push to Cloud Foundry
cf push
```

## Access Your Documentation

Once deployed, visit your application URL:

```
https://your-app-name.cfapps.eu10.hana.ondemand.com/
```

You'll see:
- ✅ Complete API documentation
- ✅ List of all available tools
- ✅ Claude Desktop configuration (ready to copy/paste)
- ✅ Interactive API testing
- ✅ Authentication setup instructions

## Configure Claude Desktop

1. Visit your deployed application URL
2. Scroll to the "Configuration" section
3. Copy the Claude Desktop configuration
4. Paste into your Claude Desktop config file:
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Example configuration:

```json
{
  "mcpServers": {
    "sap-integration-suite": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://your-app-name.cfapps.eu10.hana.ondemand.com/mcp",
        "--header",
        "x-api-oauth-client-id: YOUR_CLIENT_ID",
        "--header",
        "x-api-oauth-client-secret: YOUR_CLIENT_SECRET",
        "--header",
        "x-api-oauth-token-url: YOUR_TOKEN_URL",
        "--header",
        "x-api-base-url: YOUR_API_BASE_URL",
        "--header",
        "x-cpi-base-url: YOUR_CPI_BASE_URL",
        "--header",
        "x-cpi-oauth-client-id: YOUR_CPI_CLIENT_ID",
        "--header",
        "x-cpi-oauth-client-secret: YOUR_CPI_CLIENT_SECRET",
        "--header",
        "x-cpi-oauth-token-url: YOUR_CPI_TOKEN_URL"
      ]
    }
  }
}
```

5. Replace `YOUR_*` values with your actual credentials
6. Restart Claude Desktop
7. Start using SAP Integration Suite tools in Claude!

## Verify It's Working

1. Open Claude Desktop
2. Type: "What SAP Integration Suite tools are available?"
3. Claude will list all the available tools from your server

## Troubleshooting

If Claude can't connect:

1. Check your deployed app is running:
   ```bash
   cf apps
   ```

2. Test the health endpoint:
   ```bash
   curl https://your-app-name.cfapps.eu10.hana.ondemand.com/health
   ```

3. Verify your credentials are correct in the Claude Desktop config

4. Check Claude Desktop logs:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`

## Local Testing

Before deploying, test locally:

```bash
npm start
```

Visit: http://localhost:8080/

Configure Claude Desktop with:
```json
{
  "mcpServers": {
    "sap-integration-suite": {
      "command": "node",
      "args": ["/absolute/path/to/project/dist/index.js"]
    }
  }
}
```

## What's Next?

- Share the documentation URL with your team
- Explore available tools in the Swagger UI
- Test tools using the interactive API explorer
- Integrate with your Claude Desktop workflow

## Support

For issues or questions:
- Check the [SWAGGER_DOCS.md](./SWAGGER_DOCS.md)
- Review the [README.md](./README.md)
- Check server logs: `cf logs your-app-name --recent`
