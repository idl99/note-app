import express from "express";
import authenticationModule from "../auth/index.js";
import noteTakingModule from "../noteTaking/index.js";
import IoC from "./ioc.js";
import customErrorMiddleware from "./errorMiddleware.js";
import Database from "./db.js";
import Cache from "./cache.js";
import Logger from "./logger.js";

async function startServer() {
  const ioc = new IoC();

  const logger = Logger.createLogger();
  ioc.register("Logger", logger);

  const app = express();
  ioc.register("Application", app);

  const db = await Database.createConnection(
    process.env.MYSQL_HOST,
    process.env.MYSQL_PORT,
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    logger
  );
  ioc.register("Database", db);

  const cache = await Cache.getInstance(
    process.env.REDIS_HOST,
    process.env.REDIS_PORT
  );
  ioc.register("Cache", cache);

  const port = process.env.PORT ?? 3000;

  app.use(express.json());

  [authenticationModule, noteTakingModule].forEach((module) => {
    const { providers } = module(ioc);

    if (providers.length > 0) {
      providers.forEach(({ provide, useValue }) =>
        ioc.register(provide, useValue)
      );
    }
  });

  app.use(customErrorMiddleware);

  app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
}

startServer();
