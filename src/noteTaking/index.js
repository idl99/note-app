import { NoteRepository } from "./note.js";
import NoteController from "./noteController.js";

export default (ctx) => {
  const app = ctx.inject("Application");
  const db = ctx.inject("Database");
  const authGuard = ctx.inject("AuthGuard");

  const noteRepository = new NoteRepository(db);
  const noteController = new NoteController(app, authGuard, noteRepository);

  return {
    providers: [],
  };
};
