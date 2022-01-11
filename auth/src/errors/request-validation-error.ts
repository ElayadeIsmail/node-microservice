import { ValidationError } from 'express-validator';

export class RequestValidatorError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    // Only because we're extending a build in class
    Object.setPrototypeOf(this, RequestValidatorError.prototype);
  }
}
