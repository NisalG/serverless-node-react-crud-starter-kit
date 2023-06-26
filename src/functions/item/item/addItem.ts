import { apiResponse } from '@common/apiResponse';
import { sendErrorResponse } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AddItemInput } from '../item.model';
import { addItem } from '../item.service';

export const addItemHttp = async (logger: Logger, event: APIGatewayProxyEvent) => {
  logger.Info({ message: `Adding Item` });

  try {
    //@ts-ignore
    const input: AddItemInput = event.body;
    const claims = event.requestContext?.authorizer ?? event.requestContext?.authorizer?.claims;
    const item = await addItem(logger, input, claims);

    return apiResponse._200({ item });
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error when adding Item');
  }
};
