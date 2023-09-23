import * as bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { ConflictError, NotImplementedError } from "../errors/errors.js";
import UserModel, { UserSchema } from "./userModel.js";
import Database from "../infra/db.js";

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
   *
   * @param {Database} db
   */
  constructor(db) {
    this.userModel = UserModel.init(UserSchema, {
      sequelize: db._sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: false,
    });
  }

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
   * @param {string} email - The email of the user to check.
   * @return {Promise<boolean>} Returns true if a user with the given email exists, false otherwise.
   */
  async existsByEmail(email) {
    return await this.userModel
      .count({ where: { email } })
      .then((count) => count > 0);
  }

  /**
   * Creates a new user.
   *
   * @param {User} user - The user object containing user information.
   * @return {Promise<User>} Returns the saved User object.
   */
  async save(user) {
    await this.userModel.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
    });

    return user;
  }

  async delete(filter) {
    return await this.userModel.destroy({ where: filter });
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

  async create(name, email, password) {
    const doesUserExist = await this.userRepository.existsByEmail(email);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (doesUserExist) {
      throw new ConflictError("User exists for given email.");
    }

    // TODO validate and sanitize name and password

    return new User(nanoid(), name, email, hashedPassword);
  }
}
