import {
  Router,
  Request,
  Response,
  NextFunction,
} from 'express';
import { NOT_FOUND_ERROR } from '../constants/constants';

const notFoundRouter = Router();

notFoundRouter.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(res.status(NOT_FOUND_ERROR).send({ message: 'Source not found' }));
});

export default notFoundRouter;
