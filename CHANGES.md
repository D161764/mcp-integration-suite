# Changes Summary for Cloud Foundry Deployment

## Package Updates

### SAP Cloud SDK
- Updated all SAP Cloud SDK packages from v3.26.4 to v4.1.2
  - `@sap-cloud-sdk/connectivity`
  - `@sap-cloud-sdk/http-client`
  - `@sap-cloud-sdk/odata-v2`
  - `@sap-cloud-sdk/temporal-de-serializers`
  - `@sap-cloud-sdk/test-util`
  - `@sap-cloud-sdk/generator`

### Other Dependencies
- Updated `zod` from v3.20.0 to v4.1.12
- Updated `dotenv` from v16.4.7 to v17.2.3
- Updated `@types/node` from v18.15.0 to v22.10.0
- Added `express` v4.21.2 for HTTP server functionality
- Added `@types/express` v5.0.0

## New Files

### Cloud Foundry Configuration
- `manifest.yml` - Cloud Foundry deployment manifest
- `.cfignore` - Files to exclude from Cloud Foundry deployment
- `DEPLOYMENT.md` - Comprehensive deployment guide
- `.env.cf.example` - Example environment configuration for Cloud Foundry

### Source Code
- `src/server.ts` - HTTP server wrapper for Cloud Foundry deployment
- `src/utils/envConfig.ts` - Environment variable management with header override support

## Modified Files

### Core Application
- `package.json`
  - Updated dependencies to latest versions
  - Added `express` for HTTP server
  - Added `start:stdio` script for local development
  - Added `postinstall` script to build on deployment
  - Added Node.js and npm engine requirements

### API Layer
- `src/api/api_destination.ts` - Updated to use `getEnvValue()` for environment variables
- `src/api/cpi_auth.ts` - Updated to use `getEnvValue()` for environment variables
- `src/api/messages/sendMessageToCPI.ts` - Updated to use `getEnvValue()` for environment variables

### Utilities
- `src/utils/middleware.ts` - Refactored to use composition instead of inheritance to avoid SDK compatibility issues
- `src/api/iflow/diagram/bpmnLib.ts` - Fixed TypeScript type issue with Puppeteer screenshot path

## Key Features

### Environment Variable Handling
The application now supports two modes of configuration:

1. **Local Development**: Uses `.env` file
2. **Cloud Foundry**: Accepts configuration via HTTP headers

Supported headers:
- `x-api-oauth-client-id`
- `x-api-oauth-client-secret`
- `x-api-oauth-token-url`
- `x-api-base-url`
- `x-api-user`
- `x-api-pass`
- `x-cpi-base-url`
- `x-cpi-oauth-client-id`
- `x-cpi-oauth-client-secret`
- `x-cpi-oauth-token-url`

### Dual Server Modes

1. **STDIO Mode** (for local MCP clients)
   ```bash
   npm run start:stdio
   ```
   Uses the original MCP protocol over stdio

2. **HTTP Mode** (for Cloud Foundry)
   ```bash
   npm start
   ```
   Provides HTTP endpoints:
   - `GET /health` - Health check
   - `POST /mcp` - MCP protocol endpoint

## Deployment Process

1. Build the application: `npm run build`
2. Login to Cloud Foundry: `cf login`
3. Deploy: `cf push`

## Breaking Changes

None. The original MCP server functionality remains intact when running in stdio mode.

## Backward Compatibility

- All existing MCP tools and handlers work without modification
- The original stdio mode is still available via `npm run start:stdio`
- Local development with `.env` file continues to work as before

## Security Improvements

- Credentials are passed via HTTP headers instead of environment variables
- Environment overrides are cleared after each request
- Supports both OAuth and Basic authentication

## Testing

The build process has been verified and all TypeScript compilation issues have been resolved.
