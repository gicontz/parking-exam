import 'reflect-metadata';

import { Container } from 'inversify';

import swaggerBind from './inversify/Swagger.config';
import parkBind from './inversify/Park.config';

const iocContainer = new Container();
swaggerBind(iocContainer);
parkBind(iocContainer);

export default iocContainer;
