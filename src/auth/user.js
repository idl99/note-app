import * as bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import { BadRequestError, ConflictError } from "../errors/errors.js";
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
    this._userModel = UserModel.init(UserSchema, {
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
  async findByEmail(email) {
    const user = await this._userModel.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    return new User(user.id, user.name, user.email, user.password);
  }

  /**
   * Check if a user with the given email exists.
   *
   * @param {string} email - The email of the user to check.
   * @return {Promise<boolean>} Returns true if a user with the given email exists, false otherwise.
   */
  async existsByEmail(email) {
    return await this._userModel
      .count({ where: { email } })
      .then((count) => count > 0);
  }

  /**
   * Creates a new user.
   *
   * @param {User} aUser - The user object containing user information.
   * @return {Promise<User>} Returns the saved User object.
   */
  async save(aUser) {
    await this._userModel.upsert({ ...aUser });

    return aUser;
  }

  async delete(filter) {
    return await this._userModel.destroy({ where: filter });
  }
}

export class UserFactory {
  /**
   *
   * @param {UserRepository} userRepository
   */
  constructor(userRepository) {
    this._userRepository = userRepository;
  }

  async create(name, email, password) {
    // Doing manual validations in the interest of time, will add validation library and more validations later (e.g. Joi, zod, etc.)

    if (!name) {
      throw new BadRequestError("Name is required.");
    }

    if (!email) {
      throw new BadRequestError("Email is required.");
    }

    if (!password) {
      throw new BadRequestError("Password is required.");
    }

    // TODO email validation

    const doesUserExist = await this._userRepository.existsByEmail(email);

    if (doesUserExist) {
      throw new ConflictError("User exists for given email.");
    }

    // TODO validate and sanitize name and password

    const hashedPassword = await bcrypt.hash(password, 10);

    return new User(nanoid(), name, email, hashedPassword);
  }
}
