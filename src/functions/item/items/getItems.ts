import { apiResponse } from '@common/apiResponse';
import { ApplicationError, BadRequestError, sendErrorResponse, UnAuthorizedError } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getItemsDb } from '../item.service';
import { ItemFilterInput } from '../item.model';

export const getItemsHttp = async (logger: Logger, event: APIGatewayProxyEvent) => {
  try {
    const { page, pageSize, filterBy, sortField, sortOrder } = event.queryStringParameters;
    logger.Info({ message: `page ${page} pageSize ${pageSize} filterBy ${filterBy}` });

    const take = parseInt(pageSize) ?? 10;
    let skip = parseInt(page) ?? 1;
    skip -= 1;
    skip = skip * take;

    const filterInput: ItemFilterInput = { filterBy, take, skip, sortField, sortOrder };

    return apiResponse._200(await getItems(logger, filterInput));
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error when getting Items');
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getItems = async (logger: Logger, filterInput: ItemFilterInput) => {
  logger.Info({ message: `Getting Items with pagination` });

  try {
    const items = await getItemsDb(logger, filterInput);
    return items;
  } catch (err) {
    logger.Error(err);

    if (err instanceof UnAuthorizedError) throw err;
    if (err instanceof BadRequestError) throw err;
    throw new ApplicationError(err);
  }
};
