import { apiResponse } from '@common/apiResponse';
import { CART_USER_SERVICE } from 'src/constants/commonConstants';
import { sendErrorResponse } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getCartUser } from './getCartUser';
import MiddyWrapper from '@common/middyWrapper';

const cartUserByEmail = async (event: APIGatewayProxyEvent, context: Context) => {
  const logger = new Logger(CART_USER_SERVICE, context.awsRequestId);
  const method = event.httpMethod;

  try {
    switch (method) {
      case 'GET':
        logger.Info({ message: 'CartUserByEmail GET method called' });
        return getCartUser(logger, event);
      default:
        return apiResponse._404({
          message: `method not found`,
        });
    }
  } catch (error) {
    logger.Error(error);
    return sendErrorResponse(error, logger, 'Error on CartUserById');
  }
};

export const main = MiddyWrapper(cartUserByEmail);
