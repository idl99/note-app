import AuthGuard from "./authGuard.js";
import { AuthenticationService } from "./authenticationService.js";
import { UserRepository } from "./user.js";

export default (ctx) => {
  const userRepository = new UserRepository();
  const authenticationService = new AuthenticationService(userRepository);
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
