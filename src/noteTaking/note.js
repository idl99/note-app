import { nanoid } from "nanoid";
import { BadRequestError } from "../errors/errors.js";
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
   * @param {number} createdOn
   * @param {number} updatedOn
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
    this.updatedOn = Date.now();
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
   * @param {number} createdOn
   * @param {number} updatedOn
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
    const createdOn = Date.now();
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

  async findAll(isDeleted = false) {
    const noteDTOs = await this._notesModel.findAll({
      where: { isDeleted },
    });

    return noteDTOs.map((noteDTO) => NoteModel.toEntity(noteDTO));
  }

  /**
   *
   * @param {Note | CategorizedNote} aNote
   */
  async save(aNote) {
    return await this._notesModel.create({ ...aNote });
  }

  async delete(filter) {
    await this._notesModel.destroy({ where: filter });

    return;
  }
}
