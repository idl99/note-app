import { nanoid } from "nanoid";
import { BadRequestError, NotFoundError } from "../errors/errors.js";
import Database from "../infra/db.js";
import { NoteModel, NoteSchema } from "./noteModel.js";

export const NoteCategory = {
  PERSONAL: "PERSONAL",
  WORK: "WORK",
};

export class Note {
  static MAX_CONTENT_CHAR_LENGTH = 1000;

  /**
   *
   * @param {string} id
   * @param {string} author
   * @param {string} content
   * @param {Date} createdOn
   * @param {Date} updatedOn
   * @param {boolean} isDeleted
   */
  constructor(id, author, content, createdOn, updatedOn, isDeleted) {
    this.id = id;
    this.author = author;
    this.content = content;
    this.createdOn = createdOn;
    this.updatedOn = updatedOn;
    this.isDeleted = isDeleted;
  }

  static format(content) {
    return content.trim();
  }

  update(newContent) {
    this.content = Note.format(newContent);
    this.updatedOn = new Date();
  }

  delete() {
    this.isDeleted = true;
  }
}

export class CategorizedNote extends Note {
  /**
   *
   * @param {string} id
   * @param {string} author
   * @param {string} content
   * @param {Date} createdOn
   * @param {Date} updatedOn
   * @param {boolean} isDeleted
   * @param {string} category
   */
  constructor(id, author, content, createdOn, updatedOn, isDeleted, category) {
    super(id, author, content, createdOn, updatedOn, isDeleted);
    this.category = category;
  }
}

export class NoteFactory {
  static create(author, content, type) {
    if (!author) {
      throw new BadRequestError("Author is required");
    }

    if (!content) {
      throw new BadRequestError("Content cannot be empty");
    }

    if (content.length > Note.MAX_CONTENT_CHAR_LENGTH) {
      throw new BadRequestError(
        `Content can only be ${Note.MAX_CONTENT_CHAR_LENGTH} characters long`
      );
    }

    const noteId = nanoid();
    const createdOn = new Date();
    const formattedContent = Note.format(content);

    switch (type) {
      case NoteCategory.PERSONAL:
      case NoteCategory.WORK:
        return new CategorizedNote(
          noteId,
          author,
          formattedContent,
          createdOn,
          createdOn,
          false,
          type
        );
      default:
        return new Note(
          noteId,
          author,
          formattedContent,
          createdOn,
          createdOn,
          false
        );
    }
  }
}

export class NoteRepository {
  /**
   *
   * @param {Database} db
   */
  constructor(db) {
    this._notesModel = NoteModel.init(NoteSchema, {
      sequelize: db._sequelize,
      modelName: "Note",
      tableName: "notes",
      timestamps: false,
    });
  }

  async findAll(author = null, isDeleted = null) {
    const options = {};
    const where = {};

    if (author != null) {
      where.author = author;
    }

    if (isDeleted != null) {
      where.isDeleted = isDeleted;
    }

    const areAnyFiltersApplied = Object.keys(where).length > 0;
    if (areAnyFiltersApplied) {
      options.where = where;
    }

    const noteDTOs = await this._notesModel.findAll(options);

    return noteDTOs.map((noteDTO) => NoteModel.toEntity(noteDTO));
  }

  async findNote(id, author = null, isDeleted = null) {
    const options = { where: { id } };

    if (author != null) {
      options.where.author = author;
    }

    if (isDeleted != null) {
      options.where.isDeleted = isDeleted;
    }

    const noteDTO = await this._notesModel.findOne(options);

    if (!noteDTO) {
      return null;
    }

    return NoteModel.toEntity(noteDTO);
  }

  async getNote(id, author = null, isDeleted = null) {
    const options = { where: { id } };

    if (author != null) {
      options.where.author = author;
    }

    if (isDeleted != null) {
      options.where.isDeleted = isDeleted;
    }

    const noteDTO = await this._notesModel.findOne(options);

    if (!noteDTO) {
      throw new NotFoundError(`Note not found.`);
    }

    return NoteModel.toEntity(noteDTO);
  }

  /**
   *
   * @param {Note | CategorizedNote} aNote
   */
  async save(aNote) {
    await this._notesModel.upsert({ ...aNote });

    return aNote;
  }

  async delete(id) {
    await this._notesModel.destroy({ where: { id } });

    return;
  }

  /**
   * Deletes notes by authors.
   *
   * @param {Array<string>} authors - An array of authors.
   * @return {Promise<void>} A promise that resolves when the notes are deleted.
   */
  async deleteByAuthors(authors) {
    await this._notesModel.destroy({
      where: {
        author: authors,
      },
    });

    return;
  }
}
