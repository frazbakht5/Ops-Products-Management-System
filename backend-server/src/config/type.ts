export type EnvVars = {
	NODE_ENV: string;
	PORT: number;
	LOG_LEVEL: string;
	DB_HOST: string;
	DB_PORT: number;
	DB_USERNAME: string;
	DB_PASSWORD: string;
	DB_NAME: string;
};

export type AppConfig = {
	nodeEnv: string;
	port: number;
	logLevel: string;
	database: {
		host: string;
		port: number;
		username: string;
		password: string;
		name: string;
	};
};