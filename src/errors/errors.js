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

export class NotImplementedError extends BaseError {
  constructor(message = "Not implemented yet", detail) {
    super(message, 501, detail);
  }
}

export class ConflictError extends BaseError {
  constructor(message, detail) {
    super(message, 409, detail);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message, detail) {
    super(message, 401, detail);
  }
}
