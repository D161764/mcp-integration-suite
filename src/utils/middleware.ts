import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

type MiddlewareFunction = (
	next: () => Promise<void>,
	name: string,
	params: z.ZodRawShape
) => Promise<void>;

export type contentReturnElement =
	| {
			[x: string]: unknown;
			type: "text";
			text: string;
	  }
	| {
			[x: string]: unknown;
			type: "image";
			data: string;
			mimeType: string;
	  }
	| {
			[x: string]: unknown;
			type: "resource";
			resource:
				| {
						[x: string]: unknown;
						text: string;
						uri: string;
						mimeType?: string;
				  }
				| {
						[x: string]: unknown;
						uri: string;
						blob: string;
						mimeType?: string;
				  };
	  };

export class MiddlewareManager {
	private middlewares: MiddlewareFunction[] = [];

	use(middleware: MiddlewareFunction) {
		this.middlewares.push(middleware);
	}

	async execute(name: string, params: z.ZodRawShape) {
		const executeMiddleware = async (index: number): Promise<void> => {
			if (index >= this.middlewares.length) {
				return;
			}

			const middleware = this.middlewares[index];
			await middleware(() => executeMiddleware(index + 1), name, params);
		};

		await executeMiddleware(0);
	}
}

/**
 * Custom Middleware Server which wraps McpServer with middleware functionality
 * This is useful for logging atm
 */
export class McpServerWithMiddleware {
	public server: McpServer;
	private middlewareManager: MiddlewareManager;

	constructor(options: ConstructorParameters<typeof McpServer>[0]) {
		this.server = new McpServer(options);
		this.middlewareManager = new MiddlewareManager();
	}

	async connect(transport: any) {
		return this.server.connect(transport);
	}

	use(middleware: MiddlewareFunction) {
		this.middlewareManager.use(middleware);
	}

	async handleRequest(request: any): Promise<any> {
		try {
			const { method, params, id } = request;

			if (method === "initialize") {
				return {
					jsonrpc: "2.0",
					id,
					result: {
						protocolVersion: "2024-11-05",
						capabilities: {
							resources: {},
							tools: {}
						},
						serverInfo: {
							name: "integration-suite",
							version: "1.0.0"
						}
					}
				};
			}

			if (method === "tools/list") {
				const toolsList: any[] = [];
				(this.server.server as any)._requestHandlers?.forEach((handler: any, key: string) => {
					if (key.startsWith("tools/call:")) {
						const toolName = key.replace("tools/call:", "");
						const tool = (this as any)._registeredTools?.get?.(toolName);
						if (tool) {
							toolsList.push({
								name: toolName,
								description: tool.description || "",
								inputSchema: tool.inputSchema || { type: "object", properties: {} }
							});
						}
					}
				});

				return {
					jsonrpc: "2.0",
					id,
					result: { tools: toolsList }
				};
			}

			if (method === "tools/call") {
				const toolName = params.name;
				const toolArgs = params.arguments || {};

				const toolHandler = (this.server.server as any)._requestHandlers?.get?.(`tools/call:${toolName}`);
				if (!toolHandler) {
					return {
						jsonrpc: "2.0",
						id,
						error: {
							code: -32601,
							message: `Tool not found: ${toolName}`
						}
					};
				}

				const result = await toolHandler({ name: toolName, arguments: toolArgs }, {});

				return {
					jsonrpc: "2.0",
					id,
					result
				};
			}

			if (method === "resources/list") {
				const resourcesList: any[] = [];
				(this as any)._registeredResources?.forEach?.((resource: any) => {
					resourcesList.push({
						uri: resource.uri,
						name: resource.name,
						description: resource.description,
						mimeType: resource.mimeType
					});
				});

				return {
					jsonrpc: "2.0",
					id,
					result: { resources: resourcesList }
				};
			}

			return {
				jsonrpc: "2.0",
				id,
				error: {
					code: -32601,
					message: `Method not found: ${method}`
				}
			};
		} catch (error) {
			return {
				jsonrpc: "2.0",
				id: request.id,
				error: {
					code: -32603,
					message: "Internal error",
					data: error instanceof Error ? error.message : String(error)
				}
			};
		}
	}

	/**
	 * wrapper function for server.tool() to have middleware functionalities
	 */
	registerTool(
		name: string,
		description: string,
		params: z.ZodRawShape,
		handler: (
			args: { [x: string]: any },
			extra: { [x: string]: unknown }
		) => Promise<{
			[x: string]: unknown;
			content: Array<contentReturnElement>;
			_meta?: { [x: string]: unknown };
			isError?: boolean;
		}>
	) {
		const wrappedHandler = async (
			args: { [x: string]: any },
			extra: { [x: string]: unknown }
		) => {
			await this.middlewareManager.execute(name, params);
			return handler(args, extra);
		};

		return this.server.tool(
			name,
			{
				description,
				inputSchema: params as any
			} as any,
			wrappedHandler as any
		);
	}
}
