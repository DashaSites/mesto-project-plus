import { NO_PERMISSION_ERROR } from '../constants/constants';
// Когда пользователю не разрешается удалять/менять чужой контент

export default class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = NO_PERMISSION_ERROR;
  }
}
