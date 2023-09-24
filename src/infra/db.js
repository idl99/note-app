import { Sequelize } from "sequelize";

export default class Database {
  /**
   * Initializes a new instance of the class.
   *
   * @param {Sequelize} sequelize - The sequelize instance.
   */
  constructor(sequelize) {
    this._sequelize = sequelize;
  }

  static async createConnection(
    host,
    port,
    database,
    username,
    password,
    logger
  ) {
    const sequelize = new Sequelize(database, username, password, {
      host,
      port,
      dialect: "mysql",
      logging: logger
        ? (sql, timing) => logger.debug(sql, timing)
        : console.log,
    });

    await sequelize.authenticate();

    return new this(sequelize);
  }
}
