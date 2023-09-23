import { DataTypes, Model } from "sequelize";

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
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  updatedOn: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
};

export default class NoteModel extends Model {}
