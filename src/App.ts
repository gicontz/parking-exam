import express, {
  Application,
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';

class App {
  public app: Application;

  public port: number;

  constructor(appInit: {
    port: number;
    middlewares: ((req: Request, res: Response, next: NextFunction) => void)[];
    routers: { router: Router }[];
    errorMiddlewares: ((
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction,
    ) => void)[];
  }) {
    const { port, middlewares, routers, errorMiddlewares } = appInit;

    this.app = express();
    this.port = port;

    this.middlewares(middlewares);
    this.routes(routers);
    this.middlewares(errorMiddlewares);
  }

  private middlewares(
    middlewares: (
      | ((req: Request, res: Response, next: NextFunction) => void)
      | ((err: Error, req: Request, res: Response, next: NextFunction) => void)
    )[],
  ) {
    middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private routes(routers: { router: Router }[]) {
    routers.forEach((router) => {
      this.app.use('/', router.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Express server has started on port ${this.port}.`);
    });
  }
}

export default App;
