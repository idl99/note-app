const DEFAULT_LOG_LEVELS = ["debug", "info", "warn", "error"];

export default class Logger {
  static _instance;

  constructor() {
    this._logLevels = Logger.getLogLevels();
  }

  log(level, message, ...otherArgs) {
    if (this._logLevels.includes(level)) {
      console[level](
        `${new Date().toISOString()} ${level.toUpperCase()}: ${message}`,
        ...otherArgs
      );
    }
  }

  debug(message, ...otherArgs) {
    this.log("debug", message, ...otherArgs);
  }
  info(message, ...otherArgs) {
    this.log("info", message, ...otherArgs);
  }
  warn(message, ...otherArgs) {
    this.log("warn", message, ...otherArgs);
  }
  error(message, ...otherArgs) {
    this.log("error", message, ...otherArgs);
  }

  static createLogger() {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }

    return Logger._instance;
  }

  static getLogLevels() {
    const userDeclaredLogLevelIndex = DEFAULT_LOG_LEVELS.findIndex(
      (level) => level === process.env.LOG_LEVEL
    );

    return userDeclaredLogLevelIndex
      ? DEFAULT_LOG_LEVELS.splice(
          userDeclaredLogLevelIndex,
          DEFAULT_LOG_LEVELS.length
        )
      : DEFAULT_LOG_LEVELS;
  }
}
