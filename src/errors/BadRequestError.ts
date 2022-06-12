import { IBaseError } from './IBaseError';

export default class BadRequestError extends Error implements IBaseError {
  public statusCode: number;

  constructor(message?: string) {
    super(message);

    this.statusCode = 400;
    this.name = 'BadRequestError';
  }
}
