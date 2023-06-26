import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { apiResponse } from '@common/apiResponse';
import { Logger } from '@common/logger';
import { CART_AUTH_SERVICE } from 'src/constants/commonConstants';

import MiddyWrapper from '@common/middyWrapper';
import { sendErrorResponse } from '@common/ErrorTypes';
import { refreshCognitoUserSession } from '@functions/cartAuth/cartAuth.service';
import { RefreshCognitoSessionInput } from '../../../types/authTypes';

const refreshCognitoSession = async (event: APIGatewayProxyEvent, context: Context) => {
  const logger = new Logger(CART_AUTH_SERVICE, context.awsRequestId);
  const method = event.httpMethod;

  try {
    // @ts-ignore
    const input: RefreshCognitoSessionInput = event.body;

    switch (method) {
      case 'POST':
        logger.Info({ message: 'refreshCognitoSession POST method called' });
        return await refreshCognitoUserSession(logger, input);

      default:
        return apiResponse._404({
          message: `method not found`,
        });
    }
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error on cognito refresh session end point');
  }
};

export const main = MiddyWrapper(refreshCognitoSession);
