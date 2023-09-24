import { Sequelize } from "sequelize";
import { UserSchema } from "../../src/auth/userModel.js";
import { NoteSchema } from "../../src/noteTaking/noteModel.js";

/** @type {import('umzug').MigrationFn<{ sequelize: Sequelize }>} */
export const up = async ({ context: { sequelize } }) => {
  await sequelize.getQueryInterface().createTable("notes", NoteSchema);
  await sequelize.getQueryInterface().addIndex("notes", { fields: ["author"] });
  await sequelize.getQueryInterface().createTable("users", UserSchema);
  await sequelize.getQueryInterface().addIndex("users", { fields: ["email"] });

  return;
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async ({ context: { sequelize } }) => {
  await sequelize.getQueryInterface().dropTable("notes");
  await sequelize.getQueryInterface().dropTable("users");

  return;
};
