import app from "./app";
import { AppDataSource } from "./database/data-source";
import { config } from "./config/config";
import { logger } from "./logger";

const PORT = config.port;

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connected");

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    logger.error("Database connection failed", { err });
  });
