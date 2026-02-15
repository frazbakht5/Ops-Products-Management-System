import { createLogger, format, transports } from "winston";
import { config } from "./config/config";

const { combine, timestamp, errors, splat, colorize, printf } = format;

const logFormatter = printf(({ level, message, timestamp: time, stack, ...meta }) => {
  const metaPayload = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  const output = stack ?? message;
  return `${time} ${level}: ${output}${metaPayload}`;
});

const consoleFormat = config.nodeEnv === "production"
  ? combine(timestamp(), errors({ stack: true }), splat(), logFormatter)
  : combine(colorize(), timestamp(), errors({ stack: true }), splat(), logFormatter);

export const logger = createLogger({
  level: config.logLevel,
  format: consoleFormat,
  transports: [new transports.Console()],
  exitOnError: false,
});
