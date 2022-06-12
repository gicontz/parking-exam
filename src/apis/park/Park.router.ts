import { Router } from 'express';
import { injectable, inject } from 'inversify';

import {
  PARK_TYPES,
  IParkRouter,
  IParkController,
  IParkValidator,
} from './Park.ioc';

@injectable()
export default class ParkRouter implements IParkRouter {
  public path: string;

  public router: Router;

  private parkController: IParkController;
  private parkValidator: IParkValidator;

  constructor(
    @inject(PARK_TYPES.iParkController)
    parkController: IParkController,
    @inject(PARK_TYPES.iParkValidator)
    parkValidator: IParkValidator,
  ) {
    this.path = '/parking';
    this.router = Router();

    this.parkController = parkController;
    this.parkValidator = parkValidator;

    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post(
      `${this.path}/set`,
      this.parkValidator.setPark,
      this.parkController.setPark,
    );
    this.router.put(
      `${this.path}/park`,
      this.parkValidator.park,
      this.parkController.park,
    );
    this.router.put(
      `${this.path}/unpark`,
      this.parkValidator.unpark,
      this.parkController.unpark,
    );
  };
}
