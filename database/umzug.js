// https://github.com/sequelize/umzug/tree/main/examples/2.es-modules
// https://github.com/sequelize/umzug/tree/master/examples/4.sequelize-seeders
import { createRequire } from "module";
import Database from "../src/infra/db.js";

const require = createRequire(import.meta.url);
const { Umzug, SequelizeStorage } = require("umzug");
const { DataTypes } = require("sequelize");

const db = await Database.createConnection(
  process.env.DB_HOST,
  process.env.DB_PORT,
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS
);

export const migrator = new Umzug({
  migrations: {
    glob: "database/migrations/*.{js,cjs,mjs}",
    resolve: (params) => {
      if (params.path.endsWith(".mjs") || params.path.endsWith(".js")) {
        const getModule = () =>
          import(`file:///${params.path.replace(/\\/g, "/")}`);
        return {
          name: params.name,
          path: params.path,
          up: async (upParams) => (await getModule()).up(upParams),
          down: async (downParams) => (await getModule()).down(downParams),
        };
      }
      return {
        name: params.name,
        path: params.path,
        ...require(params.path),
      };
    },
  },
  context: { sequelize: db._sequelize, DataTypes },
  storage: new SequelizeStorage({
    sequelize: db._sequelize,
    modelName: "migration_meta",
  }),
  logger: console,
});

export const seeder = new Umzug({
  migrations: {
    glob: "database/seeds/*.{js,cjs,mjs}",
    resolve: (params) => {
      if (params.path.endsWith(".mjs") || params.path.endsWith(".js")) {
        const getModule = () =>
          import(`file:///${params.path.replace(/\\/g, "/")}`);
        return {
          name: params.name,
          path: params.path,
          up: async (upParams) => (await getModule()).up(upParams),
          down: async (downParams) => (await getModule()).down(downParams),
        };
      }
      return {
        name: params.name,
        path: params.path,
        ...require(params.path),
      };
    },
  },
  context: { database: db, sequelize: db._sequelize, DataTypes },
  storage: new SequelizeStorage({
    sequelize: db._sequelize,
    modelName: "seeder_meta",
  }),
  logger: console,
});
