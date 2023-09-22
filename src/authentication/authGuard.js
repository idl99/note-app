import { BadRequestError, UnauthorizedError } from "../errors/errors.js";
import { AuthenticationService } from "./authenticationService.js";

export default class AuthGuard {
  /**
   *
   * @param {AuthenticationService} authenticationService
   */
  constructor(authenticationService) {
    this.authenticationService = authenticationService;
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  canAllow(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
      next(new BadRequestError("Authentication token is missing."));
    }

    try {
      this.authenticationService.verify(token);
    } catch (error) {
      next(new UnauthorizedError(error.message, error));
    }
  }
}
