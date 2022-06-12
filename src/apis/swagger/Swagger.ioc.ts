import { Router } from 'express';

export const SWAGGER_TYPES = {
  iSwaggerRouter: Symbol.for('ISwaggerRouter'),
};

export interface ISwaggerRouter {
  path: string;
  router: Router;
}
