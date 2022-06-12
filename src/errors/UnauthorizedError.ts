import { IBaseError } from './IBaseError';

export default class UnauthorizedError extends Error implements IBaseError {
  public statusCode: number;

  constructor(message?: string) {
    if (message) {
      super(message);
    } else {
      super('Unauthorized');
    }

    this.statusCode = 401;
    this.name = 'UnauthorizedError';
  }
}
