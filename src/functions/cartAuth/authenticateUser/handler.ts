import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { apiResponse } from '@common/apiResponse';
import { Logger } from '@common/logger';
import { CART_AUTH_SERVICE } from 'src/constants/commonConstants';

import MiddyWrapper from '@common/middyWrapper';
import { sendErrorResponse } from '@common/ErrorTypes';
import { authenticateCognitoUser } from '@functions/cartAuth/cartAuth.service';
import { AuthenticateCognitoUserInput } from '../../../types/authTypes';

const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  const logger = new Logger(CART_AUTH_SERVICE, context.awsRequestId);
  const method = event.httpMethod;

  try {
    // @ts-ignore
    const authInput: AuthenticateCognitoUserInput = event.body;

    switch (method) {
      case 'POST':
        logger.Info({ message: 'authenticateCognitoUser POST method called' });
        return await authenticateCognitoUser(logger, authInput);

      default:
        return apiResponse._404({
          message: `method not found`,
        });
    }
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error on authenticate cognitoUser user end point');
  }
};

export const main = MiddyWrapper(handler);
