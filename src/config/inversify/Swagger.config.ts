import { Container } from 'inversify';

import { SWAGGER_TYPES, ISwaggerRouter } from '@apis/swagger/Swagger.ioc';
import SwaggerRouter from '@apis/swagger/Swagger.router';

export default (iocContainer: Container) => {
  iocContainer
    .bind<ISwaggerRouter>(SWAGGER_TYPES.iSwaggerRouter)
    .to(SwaggerRouter);
};
