import { IBaseError } from './IBaseError';

export default class NotFoundError extends Error implements IBaseError {
  public statusCode: number;

  constructor(message?: string) {
    super(message);

    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}
