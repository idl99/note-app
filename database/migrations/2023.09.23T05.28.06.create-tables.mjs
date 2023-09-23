import { Sequelize } from "sequelize";
import { UserSchema } from "../../src/authentication/userModel.js";
import { NoteSchema } from "../../src/noteTaking/noteModel.js";

/** @type {import('umzug').MigrationFn<{ sequelize: Sequelize }>} */
export const up = async ({ context: { sequelize } }) => {
  await sequelize.getQueryInterface().createTable("notes", NoteSchema);
  await sequelize.getQueryInterface().createTable("users", UserSchema);

  return;
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async ({ context: { sequelize } }) => {
  await sequelize.getQueryInterface().dropTable("notes");
  await sequelize.getQueryInterface().dropTable("users");

  return;
};
