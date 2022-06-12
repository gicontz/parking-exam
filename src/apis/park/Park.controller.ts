import { IValidatedRequest } from '@requests/IValidatedRequest';
import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { TPark, TParkingArea, TUnpark } from './Park.data';

import {
  IParkController,
  IParkService,
  PARK_TYPES,
} from './Park.ioc';

@injectable()
export default class ParkController implements IParkController {
  private parkService: IParkService;

  constructor(
    @inject(PARK_TYPES.iParkService)
    parkService: IParkService,
  ) {
    this.parkService = parkService;
  }

  public setPark = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { validatedData } = req as IValidatedRequest<TParkingArea>;
      await this.parkService.setPark(validatedData);
      res.status(200).json({
        message: 'Parking Area has been set succesfully!'
      });
    } catch (e) {
      next(e);
    }
  };
  
  public park = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { validatedData } = req as IValidatedRequest<TPark>;
      const data = await this.parkService.park(validatedData);
      res.status(200).json({
        ...data
      });
    } catch (e) {
      next(e);
    }
  };
  
  public unpark = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { validatedData } = req as IValidatedRequest<TUnpark>;
      const data = await this.parkService.unpark(validatedData);
      res.status(200).json({
        ...data
      });
    } catch (e) {
      next(e);
    }
  };
}
