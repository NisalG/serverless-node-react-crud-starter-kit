import { apiResponse } from '@common/apiResponse';
import { sendErrorResponse } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AddCartUserInput } from '../cartUser.model';
import { addCartUser } from '../cartUser.service';

export const addCartUserHttp = async (logger: Logger, event: APIGatewayProxyEvent) => {
  logger.Info({ message: `Adding cart user from http` });

  try {
    //@ts-ignore
    const input: AddCartUserInput = event.body;
    const claims = event.requestContext?.authorizer ?? event.requestContext?.authorizer?.claims;
    const cartUser = await addCartUser(logger, input, claims);

    return apiResponse._200({ cartUser });
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error when adding Cart user');
  }
};
