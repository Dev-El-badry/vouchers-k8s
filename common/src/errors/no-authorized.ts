import { CustomError } from "./custom-error";

export class NoAuthorized extends CustomError {
  statusCode: number = 401;
  reason: string = 'not allowed to be here';
  constructor() {
    super('not allowed to be here');

    Object.setPrototypeOf(this, NoAuthorized.prototype);
  } 

  serializeErrors() {
    return [{message: this.reason}];
  }
}