import { nanoid } from "nanoid";
import { User, UserRepository } from "../../src/authentication/user.js";
import { NoteRepository, NoteCategory } from "../../src/noteTaking/note.js";
import { Sequelize } from "sequelize";

/** @type {import('umzug').MigrationFn<{ sequelize: Sequelize }>} */
export const up = async ({ context: { sequelize } }) => {
  const testUsers = await seedTestUsers(sequelize);
  await seedTestUserNotes(sequelize, testUsers);

  return;
};

/** @type {import('umzug').MigrationFn<any>} */
export const down = async ({ context: { database } }) => {
  const userRepository = new UserRepository(database);
  const testUser1 = await userRepository.findByEmail("testuser1@abc.com");
  const testUser2 = await userRepository.findByEmail("testuser2@abc.com");
  const noteRepository = new NoteRepository(database);

  await noteRepository.delete({ author: [testUser1.id, testUser2.id] });
  await userRepository.delete({ id: testUser1.id });
  await userRepository.delete({ id: testUser2.id });

  return;
};

/**
 *
 * @param {Sequelize} sequelize
 * @returns
 */
async function seedTestUsers(sequelize) {
  const queryInterface = sequelize.getQueryInterface();

  const testUsers = [
    {
      id: nanoid(),
      name: "Test User 1",
      email: "testuser1@abc.com",
      password: "pass123",
    },
    {
      id: nanoid(),
      name: "Test User 2",
      email: "testuser1@abc.com",
      password: "pass456",
    },
  ];

  await queryInterface.bulkInsert("users", testUsers);

  return testUsers;
}

/**
 *
 * @param {Sequelize} sequelize
 * @param {User[]} testUsers
 */
async function seedTestUserNotes(sequelize, testUsers) {
  try {
    const [testUser1, testUser2] = testUsers;

    const queryInterface = sequelize.getQueryInterface();

    await queryInterface.bulkInsert("notes", [
      {
        id: nanoid(),
        author: testUser1.id,
        content: "[Uncategorized] note by Test User 1",
        createdOn: new Date(),
        updatedOn: new Date(),
        isDeleted: false,
      },
      {
        id: nanoid(),
        author: testUser1.id,
        content: "Personal note by Test User 1",
        createdOn: new Date(),
        updatedOn: new Date(),
        isDeleted: false,
        category: NoteCategory.PERSONAL,
      },
      {
        id: nanoid(),
        author: testUser2.id,
        content: "Personal note by Test User 2",
        createdOn: new Date(),
        updatedOn: new Date(),
        isDeleted: false,
        category: NoteCategory.PERSONAL,
      },
      {
        id: nanoid(),
        author: testUser1.id,
        content: "Work note by Test User 1",
        createdOn: new Date(),
        updatedOn: new Date(),
        isDeleted: false,
        category: NoteCategory.WORK,
      },
    ]);
  } catch (error) {
    throw error;
  }
}
