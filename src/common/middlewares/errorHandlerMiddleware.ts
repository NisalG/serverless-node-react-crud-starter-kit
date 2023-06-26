import { Logger } from '@common/logger';
import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ERROR_MIDDLEWARE } from '../../../src/constants/commonConstants';
import { apiResponse } from '@common/apiResponse';

export const errorHandlerMiddleware = (): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const onError: middy.MiddlewareFn<APIGatewayProxyEvent, APIGatewayProxyResult> = async (request) => {
    const logger = new Logger(ERROR_MIDDLEWARE);
    logger.Error(request.error);
    return apiResponse._500(request.error);
  };

  return {
    onError,
  };
};
