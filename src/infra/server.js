import express from "express";
import authenticationModule from "../authentication/index.js";
import noteTakingModule from "../noteTaking/index.js";
import IoC from "./ioc.js";
import customErrorMiddleware from "./errorMiddleware.js";
import Database from "./db.js";

async function startServer() {
  const ioc = new IoC();

  const app = express();
  ioc.register("Application", app);

  const db = await Database.createConnection(
    process.env.DB_HOST,
    process.env.DB_PORT,
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS
  );
  ioc.register("Database", db);

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
    console.log(`Server running on port ${port}`);
  });
}

startServer();
