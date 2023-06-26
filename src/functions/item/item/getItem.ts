import { apiResponse } from '@common/apiResponse';
import { BadRequestError, sendErrorResponse, UnAuthorizedError } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getItemDb } from '../item.service';

export const getItemHttp = async (logger: Logger, event: APIGatewayProxyEvent) => {
  logger.Info({ message: `Getting Item` });

  try {
    const { id } = event.pathParameters;
    // const claims = event.requestContext?.authorizer ?? event.requestContext?.authorizer?.claims;

    // if (!claims) {
    //   const err = new UnAuthorizedError(`No claims are present in the token`);
    //   logger.Error(err);
    //   throw err;
    // }

    const item = await getItemDb(logger, id);

    return apiResponse._200({ item });
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error when Getting Item');
  }
};
