import { NoteRepository } from "./note.js";
import NoteController from "./noteController.js";

export default (ctx) => {
  const app = ctx.inject("app");
  const authGuard = ctx.inject("AuthGuard");

  const noteRepository = new NoteRepository();
  const noteController = new NoteController(app, authGuard, noteRepository);

  return {
    providers: [],
  };
};
