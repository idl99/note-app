class BaseError extends Error {
  constructor(message, statusCode, detail) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

export class BadRequestError extends BaseError {
  constructor(message, detail) {
    super(message, 400, detail);
  }
}

export class InternalServerError extends BaseError {
  constructor(message, detail) {
    super(message, 500, detail);
  }
}
