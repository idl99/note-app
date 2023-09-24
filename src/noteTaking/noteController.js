import { Router } from "express";
import { NoteFactory, NoteRepository } from "./note.js";
import ApiResponse from "../infra/apiResponse.js";
import AuthGuard from "../auth/authGuard.js";
import Cache from "../infra/cache.js";

export default class NoteController {
  /**
   *
   * @param {import('express').Application} app
   * @param {AuthGuard} authGuard
   * @param {NoteRepository} noteRepository
   * @param {Cache} cache
   */
  constructor(app, authGuard, noteRepository, cache) {
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
      "/:noteId",
      authGuard.canAllow.bind(authGuard),
      this.getNote.bind(this)
    );
    router.patch(
      "/:noteId",
      authGuard.canAllow.bind(authGuard),
      this.updateNote.bind(this)
    );
    router.delete(
      "/:noteId",
      authGuard.canAllow.bind(authGuard),
      this.deleteNote.bind(this)
    );

    app.use("/notes", router);

    this._noteRepository = noteRepository;
    this._cache = cache;
  }

  /**@type {import("express").RequestHandler} */
  async createNote(req, res, next) {
    try {
      const { content, type } = req.body;

      const note = NoteFactory.create(req.user.id, content, type);

      await this._noteRepository.save(note);

      await this._cache.invalidate(`user:${req.user.id}:notes`);

      return ApiResponse.with(req, res).body(note).statusCode(201).send();
    } catch (error) {
      next(error);
    }
  }

  /**@type {import("express").RequestHandler} */
  async getNotes(req, res, next) {
    try {
      const cacheKey = `user:${req.user.id}:notes`;

      const cachedValue = await this._cache.get(cacheKey);
      if (cachedValue) {
        console.debug("Cache hit");
        return ApiResponse.with(req, res).body(cachedValue).send();
      }

      console.debug("Cache miss");
      const notes = await this._noteRepository.findAll(req.user.id, false);

      await this._cache.set(cacheKey, notes);

      return ApiResponse.with(req, res).body(notes).send();
    } catch (error) {
      next(error);
    }
  }

  async getNote(req, res, next) {
    try {
      const note = await this._noteRepository.getNote(
        req.params.noteId,
        req.user.id,
        false
      );

      return ApiResponse.with(req, res).body(note).send();
    } catch (error) {
      next(error);
    }
  }

  async updateNote(req, res, next) {
    try {
      const note = await this._noteRepository.getNote(
        req.params.noteId,
        req.user.id,
        false
      );

      note.update(req.body.content);

      await this._noteRepository.save(note);

      await this._cache.invalidate(`user:${req.user.id}:notes`);

      return ApiResponse.with(req, res).body(note).send();
    } catch (error) {
      next(error);
    }
  }

  async deleteNote(req, res, next) {
    try {
      const note = await this._noteRepository.findNote(req.params.noteId);

      if (note) {
        note.delete();

        await this._noteRepository.save(note);

        await this._cache.invalidate(`user:${req.user.id}:notes`);
      }

      return ApiResponse.with(req, res).statusCode(204).send();
    } catch (error) {
      next(error);
    }
  }
}
