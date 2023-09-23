import { DataTypes, Model } from "sequelize";

export const UserSchema = {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

/** @type {import('sequelize').Model<import("sequelize").InferAttributes<UserSchema>, import("sequelize").InferAttributes<UserSchema>>} */
export default class UserModel extends Model {}
