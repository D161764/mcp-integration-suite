export interface EnvConfig {
	API_OAUTH_CLIENT_ID?: string;
	API_OAUTH_CLIENT_SECRET?: string;
	API_OAUTH_TOKEN_URL?: string;
	API_BASE_URL?: string;
	API_USER?: string;
	API_PASS?: string;
	CPI_BASE_URL?: string;
	CPI_OAUTH_CLIENT_ID?: string;
	CPI_OAUTH_CLIENT_SECRET?: string;
	CPI_OAUTH_TOKEN_URL?: string;
}

let envOverrides: EnvConfig = {};

export const setEnvOverrides = (overrides: EnvConfig): void => {
	envOverrides = { ...overrides };
};

export const getEnvOverrides = (): EnvConfig => {
	return { ...envOverrides };
};

export const getEnvValue = (key: keyof EnvConfig): string | undefined => {
	return envOverrides[key] || process.env[key];
};

export const clearEnvOverrides = (): void => {
	envOverrides = {};
};
