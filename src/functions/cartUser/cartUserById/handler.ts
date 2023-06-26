import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { apiResponse } from '@common/apiResponse';
import { Logger } from '@common/logger';
import { CART_USER_SERVICE } from 'src/constants/commonConstants';
import MiddyWrapper from '@common/middyWrapper';
import { sendErrorResponse } from '@common/ErrorTypes';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { deleteCartUserHttp } from './deleteCartUser';
import { updateCartUserHttp } from './updateCartUser';
import { getCartUserHttp } from './getCartUser';

const cartUserById = async (event: APIGatewayProxyEvent, context: Context) => {
  const logger = new Logger(CART_USER_SERVICE, context.awsRequestId);
  const method = event.httpMethod;

  const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-18', region: 'us-east-1' });

  try {
    switch (method) {
      case 'GET':
        logger.Info({ message: 'CartUserById GET method called' });
        return getCartUserHttp(logger, event);
      case 'PUT':
        logger.Info({ message: 'Update Cart Users PUT method called' });
        return updateCartUserHttp(logger, event, cognitoidentityserviceprovider);
      case 'DELETE':
        logger.Info({ message: 'CartUserById DELETE method called' });
        return deleteCartUserHttp(logger, event, cognitoidentityserviceprovider);
      default:
        return apiResponse._404({
          message: `method not found`,
        });
    }
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error on CartUserById');
  }
};

export const main = MiddyWrapper(cartUserById);
