import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/errors.js";
import { UserRepository } from "./user.js";

export class AuthenticationService {
  /**
   *
   * @param {UserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Logs in a user with the given email and password.
   *
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @return {Promise<string>} - A promise that resolves to a token representing the logged-in user.
   */
  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    const isVerified = await bcrypt.compare(password, user.password);

    if (!isVerified) {
      throw new UnauthorizedError("Invalid email or password.");
    }

    return jwt.sign(
      { user: { id: user.id, name: user.name, email: user.email } },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );
  }

  /**
   * Verifies the given token.
   *
   * @param {string} token - The token to be verified.
   * @throws {UnauthorizedError} If the token is invalid.
   */
  verify(token) {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  }
}
