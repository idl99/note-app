import { nanoid } from "nanoid";

export class User {
  constructor(email, password) {
    this.id = nanoid();
    this.email = email;
    this.password = password;
  }
}
