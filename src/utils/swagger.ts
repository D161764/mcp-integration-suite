import swaggerJsdoc from 'swagger-jsdoc';
import { McpServerWithMiddleware } from './middleware';

export const generateSwaggerSpec = (mcpServer: McpServerWithMiddleware) => {
	const tools: any[] = [];

	(mcpServer.server.server as any)._requestHandlers?.forEach((handler: any, key: string) => {
		if (key.startsWith("tools/call:")) {
			const toolName = key.replace("tools/call:", "");
			const tool = (mcpServer as any)._registeredTools?.get?.(toolName);
			if (tool) {
				tools.push({
					name: toolName,
					description: tool.description || "No description available",
					inputSchema: tool.inputSchema || { type: "object", properties: {} }
				});
			}
		}
	});

	const swaggerDefinition = {
		openapi: '3.0.0',
		info: {
			title: 'SAP Integration Suite MCP Server',
			version: '1.0.0',
			description: `
# SAP Integration Suite MCP Server

Model Context Protocol (MCP) server for managing SAP Cloud Integration packages, integration flows, message mappings, and monitoring.

## What is MCP?

MCP (Model Context Protocol) is a standardized protocol that allows AI assistants like Claude to interact with external systems and tools. This server exposes SAP Integration Suite capabilities as MCP tools that can be used by AI assistants.

## Available Tools

This server provides ${tools.length} tools for managing SAP Cloud Integration Suite:

${tools.map(t => `- **${t.name}**: ${t.description}`).join('\n')}

## Configuration

### For Claude Desktop

Add this configuration to your Claude Desktop config file:

**Location:**
- macOS: \`~/Library/Application Support/Claude/claude_desktop_config.json\`
- Windows: \`%APPDATA%\\Claude\\claude_desktop_config.json\`

**Configuration:**

\`\`\`json
{
  "mcpServers": {
    "sap-integration-suite": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "${process.env.APP_URL || 'https://your-app.cfapps.eu10.hana.ondemand.com'}/mcp",
        "--header",
        "x-api-oauth-client-id: YOUR_OAUTH_CLIENT_ID",
        "--header",
        "x-api-oauth-client-secret: YOUR_OAUTH_CLIENT_SECRET",
        "--header",
        "x-api-oauth-token-url: https://YOUR_SUBACCOUNT.authentication.eu10.hana.ondemand.com/oauth/token",
        "--header",
        "x-api-base-url: https://YOUR_CPI_URI.hana.ondemand.com/api/v1",
        "--header",
        "x-cpi-base-url: https://YOUR_CPI_URL.hana.ondemand.com",
        "--header",
        "x-cpi-oauth-client-id: YOUR_CPI_OAUTH_CLIENT_ID",
        "--header",
        "x-cpi-oauth-client-secret: YOUR_CPI_OAUTH_CLIENT_SECRET",
        "--header",
        "x-cpi-oauth-token-url: https://YOUR_SUBACCOUNT.authentication.eu10.hana.ondemand.com/oauth/token"
      ]
    }
  }
}
\`\`\`

### For Other MCP Clients

You can use this server with any MCP-compatible client by using the \`mcp-remote\` bridge:

\`\`\`bash
npx mcp-remote ${process.env.APP_URL || 'https://your-app.cfapps.eu10.hana.ondemand.com'}/mcp \\
  --header "x-api-oauth-client-id: YOUR_OAUTH_CLIENT_ID" \\
  --header "x-api-oauth-client-secret: YOUR_OAUTH_CLIENT_SECRET" \\
  --header "x-api-oauth-token-url: https://YOUR_SUBACCOUNT.authentication.eu10.hana.ondemand.com/oauth/token" \\
  --header "x-api-base-url: https://YOUR_CPI_URI.hana.ondemand.com/api/v1"
\`\`\`

## Authentication Headers

The server accepts authentication via HTTP headers:

### OAuth Authentication (Recommended)
- \`x-api-oauth-client-id\`: OAuth client ID for API access
- \`x-api-oauth-client-secret\`: OAuth client secret
- \`x-api-oauth-token-url\`: OAuth token endpoint URL
- \`x-api-base-url\`: Base URL for CPI API
- \`x-cpi-base-url\`: Base URL for CPI instance
- \`x-cpi-oauth-client-id\`: OAuth client ID for CPI
- \`x-cpi-oauth-client-secret\`: OAuth client secret for CPI
- \`x-cpi-oauth-token-url\`: OAuth token endpoint for CPI

### Basic Authentication (Alternative)
- \`x-api-user\`: Username
- \`x-api-pass\`: Password
- \`x-api-base-url\`: Base URL for CPI API
- \`x-cpi-base-url\`: Base URL for CPI instance

## API Endpoints

- **GET /health**: Health check endpoint
- **POST /mcp**: MCP protocol endpoint (JSON-RPC 2.0)
- **GET /**: This documentation
			`,
			contact: {
				name: 'API Support'
			},
			license: {
				name: 'MIT'
			}
		},
		servers: [
			{
				url: process.env.APP_URL || 'http://localhost:8080',
				description: 'MCP Server'
			}
		],
		tags: [
			{
				name: 'Health',
				description: 'Health check endpoints'
			},
			{
				name: 'MCP',
				description: 'Model Context Protocol endpoints'
			},
			{
				name: 'Tools',
				description: 'Available MCP tools'
			}
		],
		paths: {
			'/health': {
				get: {
					tags: ['Health'],
					summary: 'Health check',
					description: 'Check if the server is running',
					responses: {
						'200': {
							description: 'Server is healthy',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											status: {
												type: 'string',
												example: 'ok'
											},
											timestamp: {
												type: 'string',
												format: 'date-time'
											}
										}
									}
								}
							}
						}
					}
				}
			},
			'/mcp': {
				post: {
					tags: ['MCP'],
					summary: 'MCP Protocol Endpoint',
					description: 'JSON-RPC 2.0 endpoint for MCP protocol communication',
					parameters: [
						{
							name: 'x-api-oauth-client-id',
							in: 'header',
							schema: { type: 'string' },
							description: 'OAuth client ID for API access'
						},
						{
							name: 'x-api-oauth-client-secret',
							in: 'header',
							schema: { type: 'string' },
							description: 'OAuth client secret'
						},
						{
							name: 'x-api-oauth-token-url',
							in: 'header',
							schema: { type: 'string' },
							description: 'OAuth token endpoint URL'
						},
						{
							name: 'x-api-base-url',
							in: 'header',
							schema: { type: 'string' },
							description: 'Base URL for CPI API'
						}
					],
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										jsonrpc: {
											type: 'string',
											example: '2.0'
										},
										id: {
											type: 'number',
											example: 1
										},
										method: {
											type: 'string',
											enum: ['initialize', 'tools/list', 'tools/call', 'resources/list'],
											example: 'tools/list'
										},
										params: {
											type: 'object'
										}
									}
								}
							}
						}
					},
					responses: {
						'200': {
							description: 'Successful MCP response',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											jsonrpc: {
												type: 'string',
												example: '2.0'
											},
											id: {
												type: 'number'
											},
											result: {
												type: 'object'
											}
										}
									}
								}
							}
						}
					}
				}
			}
		},
		components: {
			schemas: {
				Tool: {
					type: 'object',
					properties: {
						name: {
							type: 'string',
							description: 'Tool name'
						},
						description: {
							type: 'string',
							description: 'Tool description'
						},
						inputSchema: {
							type: 'object',
							description: 'JSON Schema for tool input parameters'
						}
					}
				}
			}
		}
	};

	const toolsSection = {
		paths: {} as any
	};

	tools.forEach(tool => {
		const pathKey = `/tools/${tool.name}`;
		toolsSection.paths[pathKey] = {
			post: {
				tags: ['Tools'],
				summary: tool.name,
				description: tool.description,
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								properties: {
									jsonrpc: {
										type: 'string',
										example: '2.0'
									},
									id: {
										type: 'number',
										example: 1
									},
									method: {
										type: 'string',
										example: 'tools/call'
									},
									params: {
										type: 'object',
										properties: {
											name: {
												type: 'string',
												example: tool.name
											},
											arguments: tool.inputSchema
										}
									}
								}
							}
						}
					}
				},
				responses: {
					'200': {
						description: 'Tool execution result',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										jsonrpc: {
											type: 'string'
										},
										id: {
											type: 'number'
										},
										result: {
											type: 'object',
											properties: {
												content: {
													type: 'array',
													items: {
														type: 'object'
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		};
	});

	return {
		...swaggerDefinition,
		paths: {
			...swaggerDefinition.paths,
			...toolsSection.paths
		}
	};
};
