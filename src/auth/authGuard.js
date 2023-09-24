import { BadRequestError, UnauthorizedError } from "../errors/errors.js";
import { AuthenticationService } from "./authService.js";

export default class AuthGuard {
  /**
   *
   * @param {AuthenticationService} authenticationService
   */
  constructor(authenticationService) {
    this._authenticationService = authenticationService;
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
      const payload = this._authenticationService.verify(token);

      req.user = payload.user;

      next();
    } catch (error) {
      next(new UnauthorizedError(error.message, error));
    }
  }
}
