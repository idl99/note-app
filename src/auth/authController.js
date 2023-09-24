import { Router } from "express";
import { AuthenticationService } from "./authService.js";
import ApiResponse from "../infra/apiResponse.js";
import { UserFactory, UserRepository } from "./user.js";

export default class AuthController {
  /**
   *
   * @param {import('express').Application} app
   * @param {UserFactory} userFactory
   * @param {UserRepository} userRepository
   * @param {AuthenticationService} authenticationService
   */
  constructor(app, userFactory, userRepository, authenticationService) {
    const router = Router();

    router.post("/register", this.register.bind(this));
    router.post("/login", this.login.bind(this));

    app.use("/users", router);

    this._userFactory = userFactory;
    this._userRepository = userRepository;
    this._authenticationService = authenticationService;
  }

  async register(req, res, next) {
    try {
      const user = await this._userFactory.create(
        req.body.name,
        req.body.email,
        req.body.password
      );

      await this._userRepository.save(user);

      const { password: userPassword, ...nonSensitizedUserObject } = user;

      return ApiResponse.with(req, res)
        .body(nonSensitizedUserObject)
        .statusCode(201)
        .send();
    } catch (error) {
      next(error);
    }
  }

  /**
   *
   * @type {import("express").RequestHandler}
   */
  async login(req, res, next) {
    try {
      const token = await this._authenticationService.login(
        req.body.email,
        req.body.password
      );

      return ApiResponse.with(req, res).body({ token }).statusCode(200).send();
    } catch (error) {
      next(error);
    }
  }
}
