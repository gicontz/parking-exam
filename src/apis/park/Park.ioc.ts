import { Router, Request, Response, NextFunction } from 'express';

import {
  TParkingArea,
  TPark,
  TParkingMap,
  TParkSlot,
  TUnpark,
  TUnParkSlot
} from './Park.data';

export const PARK_TYPES = {
  iParkRouter: Symbol.for('IParkRouter'),
  iParkValidator: Symbol.for('IParkValidator'),
  iParkController: Symbol.for('IParkController'),
  iParkService: Symbol.for('IParkService'),
  iParkDao: Symbol.for('IParkDao'),
};

export interface IParkRouter {
  path: string;
  router: Router;
}

export interface IParkValidator {
  setPark: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  park: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  unpark: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

export interface IParkController {
  setPark: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  park: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  unpark: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

export interface IParkService {
  setPark: (data: TParkingArea) => void;
  park: (data: TPark) => TParkSlot | null;
  unpark: (data: TUnpark) => TUnParkSlot | null;
}
