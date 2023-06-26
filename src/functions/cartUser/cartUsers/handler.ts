import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { apiResponse } from '@common/apiResponse';
import { Logger } from '@common/logger';
import { CART_USER_SERVICE } from 'src/constants/commonConstants';
import MiddyWrapper from '@common/middyWrapper';
import { sendErrorResponse } from '@common/ErrorTypes';
import { addCartUserHttp } from './addCartUser';
import { getCartUsersHttp } from './getCartUsers';

const cartUsers = async (event: APIGatewayProxyEvent, context: Context) => {
  const logger = new Logger(CART_USER_SERVICE, context.awsRequestId);
  const method = event.httpMethod;

  try {
    switch (method) {
      case 'GET':
        logger.Info({ message: 'CartUsers GET method called' });
        return getCartUsersHttp(logger, event);
        break;
      case 'POST':
        {
          logger.Info({ message: 'CartUsers POST method called' });
          return await addCartUserHttp(logger, event);
        }
        break;
      default:
        return apiResponse._404({
          message: `method not found`,
        });
    }
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error for cartUsers');
  }
};

export const main = MiddyWrapper(cartUsers);
