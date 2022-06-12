import { IBaseError } from './IBaseError';

export default class ConflictError extends Error implements IBaseError {
  public statusCode: number;

  constructor(message?: string) {
    super(message);

    this.statusCode = 409;
    this.name = 'ConflictError';
  }
}
