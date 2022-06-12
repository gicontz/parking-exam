import { Router } from 'express';
import { injectable } from 'inversify';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import config from '@config/Config';

import { ISwaggerRouter } from './Swagger.ioc';

const swaggerDefinition = {
  openapi: '3.0.0',
  components: {},
  info: {
    title: 'Parking Server',
    version: '0.1.0',
  },
  servers: [
    {
      url: config.app.BASE_URL,
      description: 'Local machine',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['docs/**/*.yaml'],
};

const swaggerSpecs = swaggerJsDoc(options);

@injectable()
export default class SwaggerRouter implements ISwaggerRouter {
  public path: string;

  public router: Router;

  constructor() {
    this.path = '/docs';
    this.router = Router();

    this.initRoutes();
  }

  private initRoutes() {
    this.router.use(this.path, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  }
}
