import { NoteRepository } from "./note.js";
import NoteController from "./noteController.js";
import NoteModel, { NoteSchema } from "./noteModel.js";

export default (ctx) => {
  const app = ctx.inject("Application");
  const db = ctx.inject("Database");
  const authGuard = ctx.inject("AuthGuard");

  NoteModel.init(NoteSchema, {
    sequelize: db._sequelize,
    modelName: "Note",
    tableName: "notes",
  });
  const noteRepository = new NoteRepository();
  const noteController = new NoteController(app, authGuard, noteRepository);

  return {
    providers: [],
  };
};
