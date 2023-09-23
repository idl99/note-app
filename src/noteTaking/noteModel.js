import { DataTypes, Model } from "sequelize";
import { CategorizedNote, Note } from "./note.js";

/**
 * @type {import("sequelize").ModelAttributes<NoteModel>}
 */
export const NoteSchema = {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdOn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updatedOn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
};

export class NoteModel extends Model {
  /**
   *
   * @param {*} noteDTO
   * @returns {Note}
   */
  static toEntity(noteDTO) {
    if (noteDTO.category) {
      return new CategorizedNote(
        noteDTO.id,
        noteDTO.author,
        noteDTO.content,
        noteDTO.createdOn,
        noteDTO.updatedOn,
        noteDTO.isDeleted,
        noteDTO.category
      );
    }

    return new Note(
      noteDTO.id,
      noteDTO.author,
      noteDTO.content,
      noteDTO.createdOn,
      noteDTO.updatedOn,
      noteDTO.isDeleted
    );
  }
}
