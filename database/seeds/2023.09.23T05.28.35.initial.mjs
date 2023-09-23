import {
  User,
  UserFactory,
  UserRepository,
} from "../../src/authentication/user.js";
import Database from "../../src/infra/db.js";
import {
  NoteFactory,
  NoteRepository,
  NoteCategory,
} from "../../src/noteTaking/note.js";

/** @type {import('umzug').MigrationFn<{ database: Database }>} */
export const up = async ({ context: { database } }) => {
  const testUser = await seedTestUser(database);
  await seedTestUserNotes(database, testUser);

  return;
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async ({ context: { database } }) => {
  const userRepository = new UserRepository(database);
  const userToDelete = await userRepository.findByEmail("test@abc.com");
  const noteRepository = new NoteRepository(database);

  await noteRepository.delete({ author: userToDelete.id });
  await userRepository.delete({ id: userToDelete.id });

  return;
};

async function seedTestUser(database) {
  const userRepository = new UserRepository(database);

  const factory = new UserFactory(userRepository);

  const user = await factory.create("Test User", "test@abc.com", "pass123");

  return await userRepository.save(user);
}

/**
 *
 * @param {Database} database
 * @param {User} testUser
 */
async function seedTestUserNotes(database, testUser) {
  try {
    const noteRepository = new NoteRepository(database);

    const uncategorizedNote = NoteFactory.create(testUser.id, "Test note");

    const personalNote = NoteFactory.create(
      testUser.id,
      "Test Personal note",
      NoteCategory.PERSONAL
    );

    const workNote = NoteFactory.create(
      testUser.id,
      "Test Work note",
      NoteCategory.WORK
    );

    await noteRepository.save(uncategorizedNote);
    await noteRepository.save(personalNote);
    await noteRepository.save(workNote);
  } catch (error) {
    throw error;
  }
}
