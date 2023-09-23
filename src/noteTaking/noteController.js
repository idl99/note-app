import { Router } from "express";
import { NoteFactory, NoteRepository } from "./note.js";
import ApiResponse from "../infra/apiResponse.js";
import AuthGuard from "../auth/authGuard.js";

export default class NoteController {
  /**
   *
   * @param {import('express').Application} app
   * @param {AuthGuard} authGuard
   * @param {NoteRepository} noteRepository
   */
  constructor(app, authGuard, noteRepository) {
    const router = Router();

    router.post(
      "/",
      authGuard.canAllow.bind(authGuard),
      this.createNote.bind(this)
    );
    router.get(
      "/",
      authGuard.canAllow.bind(authGuard),
      this.getNotes.bind(this)
    );
    router.get(
      "/:id",
      authGuard.canAllow.bind(authGuard),
      this.getNote.bind(this)
    );
    router.put(
      "/:id",
      authGuard.canAllow.bind(authGuard),
      this.updateNote.bind(this)
    );
    router.delete(
      "/:id",
      authGuard.canAllow.bind(authGuard),
      this.deleteNote.bind(this)
    );

    app.use("/notes", router);

    this.noteRepository = noteRepository;
  }

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  createNote(req, res, next) {
    const { author, content, type } = req.body;

    const note = NoteFactory.create(author, content, type);

    const savedNote = this.noteRepository.save(note);

    return ApiResponse.with(req, res).body(savedNote).statusCode(201).send();
  }

  /**@type {import("express").RequestHandler} */
  async getNotes(req, res, next) {
    const notes = await this.noteRepository.findAll();

    return ApiResponse.with(req, res).body(notes).send();
  }

  getNote() {}

  updateNote() {}

  deleteNote() {}
}
