import * as bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { ConflictError, NotImplementedError } from "../errors/errors.js";

export class User {
  /**
   *
   * @param {string} id
   * @param {string} name
   * @param {string} email
   * @param {string} password
   */
  constructor(id, name, email, password) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
}

export class UserRepository {
  /**
   * Find a user by their email.
   *
   * @param {string} email - The email of the user to find.
   * @return {Promise<User>} This function does not return anything.
   */
  findByEmail(email) {
    throw new NotImplementedError();
  }

  /**
   * Check if a user with the given email exists.
   *
   * @param {string} userId - The email of the user to check.
   * @return {Promise<boolean>} Returns true if a user with the given email exists, false otherwise.
   */
  existsByEmail(userId) {
    throw new NotImplementedError();
  }

  /**
   * Creates a new user.
   *
   * @param {User} user - The user object containing user information.
   * @return {Promise<User>} Returns the saved User object.
   */
  save(user) {
    throw new NotImplementedError();
  }
}

export class UserFactory {
  /**
   *
   * @param {UserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async create(id, name, email, password) {
    const doesUserExist = await this.userRepository.existsByEmail(id);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (doesUserExist) {
      throw new ConflictError("User exists for given email.");
    }

    // TODO validate and sanitize name and password

    const user = new User(nanoid(), name, email, hashedPassword);

    return await this.userRepository.save(user);
  }
}
