import { Container } from 'inversify';

import {
  PARK_TYPES,
  IParkRouter,
  IParkController,
  IParkService,
  IParkValidator,
} from '@apis/park/Park.ioc';
import ParkRouter from '@apis/park/Park.router';
import ParkController from '@apis/park/Park.controller';
import ParkValidator from '@apis/park/Park.validator';
import ParkService from '@apis/park/Park.service';

export default (iocContainer: Container) => {
  iocContainer
    .bind<IParkRouter>(PARK_TYPES.iParkRouter)
    .to(ParkRouter);
  iocContainer
    .bind<IParkController>(PARK_TYPES.iParkController)
    .to(ParkController);
  iocContainer
  .bind<IParkValidator>(PARK_TYPES.iParkValidator)
  .to(ParkValidator);
  iocContainer
    .bind<IParkService>(PARK_TYPES.iParkService)
    .to(ParkService);
};
