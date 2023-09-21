import { nanoid } from "nanoid";
import { BadRequestError, InternalServerError } from "../errors/errors.js";

const NoteTypes = {
  PERSONAL: "PERSONAL",
  WORK: "WORK",
};

class Note {
  static MAX_CONTENT_CHAR_LENGTH = 1000;

  /**
   *
   * @param {string} id
   * @param {string} author
   * @param {string} content
   * @param {number} createdOn
   */
  constructor(id, author, content, createdOn) {
    if (new.target === Note) {
      // To enforce that there can't be plain Note type objects, only concrete types (Personal, Work, etc.)
      throw new InternalServerError("Cannot instantiate Note");
    }

    this.id = id;
    this.author = author;
    this.content = content;
    this.createdOn = createdOn;
  }

  static format(content) {
    return content.trim();
  }

  update(newContent) {
    this.content = Note.format(newContent);
  }
}

class PersonalNote extends Note {
  /**
   *
   * @param {string} id
   * @param {string} author
   * @param {string} content
   * @param {number} createdOn
   */
  constructor(id, author, content, createdOn) {
    super(id, author, content, createdOn);
    this.type = NoteTypes.PERSONAL;
  }
}

class WorkNote extends Note {
  /**
   *
   * @param {string} id
   * @param {string} author
   * @param {string} content
   * @param {number} createdOn
   */
  constructor(id, author, content, createdOn) {
    super(id, author, content, createdOn);
    this.type = NoteTypes.WORK;
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

    switch (type) {
      case NoteTypes.PERSONAL:
        return new PersonalNote(noteId, author, content, createdOn);
      case NoteTypes.WORK:
        return new WorkNote(noteId, author, content, createdOn);
      default:
        throw new BadRequestError("Invalid note type");
    }
  }
}