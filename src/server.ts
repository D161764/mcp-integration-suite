import express, { Request, Response } from "express";
import path from "path";
import { projPath } from "./index";
import { config } from "dotenv";
import { writeToErrLog, writeToLog } from "./utils/logging";
import { registerDeleteTempOnExit } from "./utils/exitHandler";
import { setEnvOverrides, clearEnvOverrides } from "./utils/envConfig";
import { McpServerWithMiddleware } from "./utils/middleware";
import { registerAllHandlers } from "./handlers";
import "./utils/exitHandler";

config({ path: path.join(projPath, ".env") });

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

const mcpServer = new McpServerWithMiddleware({
	name: "integration-suite",
	version: "1.0.0",
	capabilities: {
		resources: {},
		tools: {},
	},
});

registerAllHandlers(mcpServer);

export const logError = (msg: any): void => {
	writeToErrLog(msg);
};

export const logInfo = (msg: any): void => {
	writeToLog(msg);
};

app.get("/health", (_req: Request, res: Response) => {
	res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/mcp", async (req: Request, res: Response) => {
	try {
		const headers = req.headers;
		const envOverrides: any = {};

		if (headers["x-api-oauth-client-id"]) {
			envOverrides.API_OAUTH_CLIENT_ID = headers["x-api-oauth-client-id"] as string;
		}
		if (headers["x-api-oauth-client-secret"]) {
			envOverrides.API_OAUTH_CLIENT_SECRET = headers["x-api-oauth-client-secret"] as string;
		}
		if (headers["x-api-oauth-token-url"]) {
			envOverrides.API_OAUTH_TOKEN_URL = headers["x-api-oauth-token-url"] as string;
		}
		if (headers["x-api-base-url"]) {
			envOverrides.API_BASE_URL = headers["x-api-base-url"] as string;
		}
		if (headers["x-api-user"]) {
			envOverrides.API_USER = headers["x-api-user"] as string;
		}
		if (headers["x-api-pass"]) {
			envOverrides.API_PASS = headers["x-api-pass"] as string;
		}
		if (headers["x-cpi-base-url"]) {
			envOverrides.CPI_BASE_URL = headers["x-cpi-base-url"] as string;
		}
		if (headers["x-cpi-oauth-client-id"]) {
			envOverrides.CPI_OAUTH_CLIENT_ID = headers["x-cpi-oauth-client-id"] as string;
		}
		if (headers["x-cpi-oauth-client-secret"]) {
			envOverrides.CPI_OAUTH_CLIENT_SECRET = headers["x-cpi-oauth-client-secret"] as string;
		}
		if (headers["x-cpi-oauth-token-url"]) {
			envOverrides.CPI_OAUTH_TOKEN_URL = headers["x-cpi-oauth-token-url"] as string;
		}

		setEnvOverrides(envOverrides);

		const mcpRequest = req.body;

		logInfo(`Received MCP request: ${JSON.stringify(mcpRequest)}`);

		if (!mcpRequest.jsonrpc || !mcpRequest.method) {
			return res.status(400).json({
				jsonrpc: "2.0",
				id: mcpRequest.id,
				error: {
					code: -32600,
					message: "Invalid Request"
				}
			});
		}

		const result = await mcpServer.handleRequest(mcpRequest);

		logInfo(`MCP response: ${JSON.stringify(result)}`);

		res.json(result);
	} catch (error) {
		logError(error);
		res.status(500).json({
			jsonrpc: "2.0",
			id: req.body.id,
			error: {
				code: -32603,
				message: "Internal error",
				data: error instanceof Error ? error.message : String(error)
			}
		});
	} finally {
		clearEnvOverrides();
	}
});

async function main() {
	registerDeleteTempOnExit();

	app.listen(PORT, () => {
		logInfo(`HTTP Server running on port ${PORT}`);
		console.log(`HTTP Server running on port ${PORT}`);
		console.log(`Health check: http://localhost:${PORT}/health`);
		console.log(`\nNote: This server provides HTTP endpoints for Cloud Foundry deployment.`);
		console.log(`For full MCP functionality, use: npm run start:stdio`);
	});
}

process.on("uncaughtException", (err) => {
	logError(err);
	process.exit(2);
});

if (!process.env.JEST_WORKER_ID) {
	main().catch((err) => {
		logError(err);
		console.error(err);
		process.exit(1);
	});
}
