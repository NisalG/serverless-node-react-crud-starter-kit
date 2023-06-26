import { middyfy } from '@libs/lambda';
import httpSecurityHeaders from '@middy/http-security-headers';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';
import cors from '@middy/http-cors';

const wrapper = (handler) => {
  return middyfy(handler).use(errorHandlerMiddleware()).use(httpSecurityHeaders()).use(cors());
};

export default wrapper;