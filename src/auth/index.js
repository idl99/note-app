import AuthController from "./authController.js";
import AuthGuard from "./authGuard.js";
import { AuthenticationService } from "./authService.js";
import { UserFactory, UserRepository } from "./user.js";

export default (ctx) => {
  const app = ctx.inject("Application");
  const db = ctx.inject("Database");

  const userRepository = new UserRepository(db);
  const userFactory = new UserFactory(userRepository);
  const authenticationService = new AuthenticationService(userRepository);
  const authController = new AuthController(
    app,
    userFactory,
    userRepository,
    authenticationService
  );
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
