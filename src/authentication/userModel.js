import { DataTypes, Model } from "sequelize";

/**
 * @type {import("sequelize").ModelAttributes<UserModel>}
 */
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

export default class UserModel extends Model {}
