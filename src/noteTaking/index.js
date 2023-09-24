import { NoteRepository } from "./note.js";
import NoteController from "./noteController.js";

export default (ctx) => {
  const app = ctx.inject("Application");
  const logger = ctx.inject("Logger");
  const db = ctx.inject("Database");
  const cache = ctx.inject("Cache");
  const authGuard = ctx.inject("AuthGuard");

  const noteRepository = new NoteRepository(db);
  const noteController = new NoteController(
    app,
    logger,
    authGuard,
    noteRepository,
    cache
  );

  return {
    providers: [],
  };
};
