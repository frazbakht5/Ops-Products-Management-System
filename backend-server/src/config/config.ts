import dotenv from "dotenv";
import { envSchema } from "./schema";
import { AppConfig, EnvVars } from "./type";
dotenv.config({ quiet: true });

const { value, error } = envSchema.validate(process.env, {
  abortEarly: false,
  convert: true,
});

if (error) {
  const details = error.details.map((detail) => detail.message).join("; ");
  console.error("Environment validation failed:", details);
  throw new Error(`Environment validation failed: ${details}`);
}

const envVars = value as EnvVars;

export const config: AppConfig = {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  logLevel: envVars.LOG_LEVEL,
  database: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    username: envVars.DB_USERNAME,
    password: envVars.DB_PASSWORD,
    name: envVars.DB_NAME,
  },
};
