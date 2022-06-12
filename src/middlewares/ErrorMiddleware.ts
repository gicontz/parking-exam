import { Request, Response, NextFunction } from 'express';

import { IBaseError } from '@errors/IBaseError';

export default (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if ((err as IBaseError).statusCode) {
    res
      .status((err as IBaseError).statusCode)
      .json({ name: err.name, message: err.message });
  } else {
    res.status(500).json({ name: err.name, message: err.message });
  }
};
