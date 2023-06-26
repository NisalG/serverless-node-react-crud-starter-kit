import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { apiResponse } from '@common/apiResponse';
import { Logger } from '@common/logger';
import { CART_AUTH_SERVICE } from 'src/constants/commonConstants';

import MiddyWrapper from '@common/middyWrapper';
import { sendErrorResponse } from '@common/ErrorTypes';
import { resetPassword } from '@functions/cartAuth/cartAuth.service';
import { ResetPasswordInput } from '../../../types/authTypes';

const resetPasswordCognito = async (event: APIGatewayProxyEvent, context: Context) => {
  const logger = new Logger(CART_AUTH_SERVICE, context.awsRequestId);
  const method = event.httpMethod;

  try {
    //@ts-ignore
    const input: ResetPasswordInput = event.body;

    switch (method) {
      case 'POST':
        logger.Info({ message: 'resetPasswordCognito POST method called' });
        return await resetPassword(logger, input);

      default:
        return apiResponse._404({
          message: `method not found`,
        });
    }
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error on cognito reset password end point');
  }
};

export const main = MiddyWrapper(resetPasswordCognito);
