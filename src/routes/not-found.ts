import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import NotFoundError from '../errors/not-found-error';

const notFoundRouter = Router();

notFoundRouter.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Source not found'));
});

export default notFoundRouter;
