import AuthController from "./authController.js";
import AuthGuard from "./authGuard.js";
import { AuthenticationService } from "./authenticationService.js";
import { UserRepository } from "./user.js";

export default (ctx) => {
  const app = ctx.inject("Application");
  const db = ctx.inject("Database");

  const userRepository = new UserRepository(db);
  const authenticationService = new AuthenticationService(userRepository);
  const authController = new AuthController(app, authenticationService);
  const authGuard = new AuthGuard(authenticationService);

  return {
    providers: [
      {
        provide: "AuthGuard",
        useValue: authGuard,
      },
    ],
  };
};
