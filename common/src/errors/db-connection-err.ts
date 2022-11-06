import { CustomError } from './custom-error';

export class DBConnectionError extends CustomError {
  statusCode: number = 500;
  reason: string = 'invalid connection with DB';
  constructor() {
    super('invalid connection with DB');

    Object.setPrototypeOf(this, DBConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
