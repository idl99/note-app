import { UserFactory, UserRepository } from "../../src/authentication/user.js";
import Database from "../../src/infra/db.js";

/** @type {import('umzug').MigrationFn<{ database: Database }>} */
export const up = async ({ context: { database } }) => {
  const userRepository = new UserRepository(database);

  const factory = new UserFactory(userRepository);

  const user = await factory.create("Test User", "test@abc.com", "pass123");

  await userRepository.save(user);

  return;
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async ({ context: { database } }) => {
  const userRepository = new UserRepository(database);

  return userRepository.delete({ email: "test@abc.com" });
};
