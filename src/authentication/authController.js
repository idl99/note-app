import { Router } from "express";
import { AuthenticationService } from "./authenticationService.js";
import ApiResponse from "../infra/apiResponse.js";

export default class AuthController {
  /**
   *
   * @param {import('express').Application} app
   * @param {AuthenticationService} authenticationService
   */
  constructor(app, authenticationService) {
    const router = Router();

    router.post("/login", this.login.bind(this));

    app.use("/users", router);

    this.authenticationService = authenticationService;
  }

  register() {}

  /**
   *
   * @type {import("express").RequestHandler}
   */
  async login(req, res, next) {
    try {
      const token = await this.authenticationService.login(
        req.body.email,
        req.body.password
      );

      return ApiResponse.with(req, res).body({ token }).statusCode(200).send();
    } catch (error) {
      next(error);
    }
  }
}
