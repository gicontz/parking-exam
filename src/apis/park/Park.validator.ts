import Joi from 'joi';

import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';

import { IValidatedRequest } from '@requests/IValidatedRequest';

import { IParkValidator } from './Park.ioc';
import { TParkingArea, TPark, TUnpark } from './Park.data';

@injectable()
export default class ParkValidator implements IParkValidator {
  public setPark = async (req: Request, res: Response, next: NextFunction) => {
    const bodySchema = Joi.object().keys({
      entryPoints: Joi.number().greater(2).required(),
      map: Joi.array().items(Joi.array().items(Joi.number())).required(),
      slotSizes: Joi.array().items(Joi.number()).required(),
    });

    try {
      const { entryPoints, map, slotSizes } = await bodySchema.validateAsync(req.body);

      (req as IValidatedRequest<TParkingArea>).validatedData = {
        entryPoints,
        map,
        slotSizes,
        occupancy: [],
      };

      next();
    } catch (e) {
      next(e);
    }
  };
  
  public park = async (req: Request, res: Response, next: NextFunction) => {
    const querySchema = Joi.object().keys({
      plateNumber: Joi.string().required(),
      size: Joi.number().allow(...[0,1,2]),
    });

    try {
      const { plateNumber, size } = await querySchema.validateAsync(req.query);

      (req as IValidatedRequest<TPark>).validatedData = {
        plateNumber,
        size,
      };

      next();
    } catch (e) {
      next(e);
    }
  };
  
  public unpark = async (req: Request, res: Response, next: NextFunction) => {
    const querySchema = Joi.object().keys({
      plateNumber: Joi.string().required(),
      currentDate: Joi.date().required(),
    });

    try {
      const { plateNumber, currentDate } = await querySchema.validateAsync(req.query);

      (req as IValidatedRequest<TUnpark>).validatedData = {
        plateNumber,
        currentDate: new Date(currentDate),
      };

      next();
    } catch (e) {
      next(e);
    }
  };
}
