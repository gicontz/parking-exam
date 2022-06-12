import { IBaseError } from './IBaseError';

export default class ForbiddenError extends Error implements IBaseError {
  public statusCode: number;

  constructor(message?: string) {
    if (message) {
      super(message);
    } else {
      super('Forbidden');
    }

    this.statusCode = 403;
    this.name = 'ForbiddenError';
  }
}
