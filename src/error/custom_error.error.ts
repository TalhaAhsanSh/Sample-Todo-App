export class ItemNotFoundError extends Error {
    status: number;
    constructor(message = 'Item not found') {
      super(message);
      this.status = 404;
      this.name = 'ItemNotFoundError';
      Error.captureStackTrace(this, this.constructor);
    }
}
  
export class BadRequestError extends Error {
    status: number;
    constructor(message = 'Bad request') {
      super(message);
      this.status = 400;
      this.name = 'BadRequestError';
      Error.captureStackTrace(this, this.constructor);
    }
}
  
export class ConflictError extends Error {
    status: number;
    constructor(message = 'Conflict') {
      super(message);
      this.status = 409;
      this.name = 'ConflictError';
      Error.captureStackTrace(this, this.constructor);
    }
}
  
export class UnauthorizedError extends Error {
    status: number;
    constructor(message = 'Unauthorized') {
      super(message);
      this.status = 401;
      this.name = 'UnauthorizedError';
      Error.captureStackTrace(this, this.constructor);
    }
}
  
export class ForbiddenError extends Error {
    status: number;
    constructor(message = 'Forbidden') {
      super(message);
      this.status = 403;
      this.name = 'ForbiddenError';
      Error.captureStackTrace(this, this.constructor);
    }
}
  