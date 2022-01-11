export class DatabaseConnectionError extends Error {
  reason = 'Error Connection to database';
  constructor() {
    super();

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
