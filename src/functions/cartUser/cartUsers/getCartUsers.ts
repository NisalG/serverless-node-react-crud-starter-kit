import { apiResponse } from '@common/apiResponse';
import { ApplicationError, BadRequestError, sendErrorResponse, UnAuthorizedError } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getCartUsersDb } from '../cartUser.service';
import { CartUserFilterInput } from '../cartUser.model';

export const getCartUsersHttp = async (logger: Logger, event: APIGatewayProxyEvent) => {
  try {
    const { page, pageSize, filterBy, sortField, sortOrder } = event.queryStringParameters;
    logger.Info({ message: `page ${page} pageSize ${pageSize} filterBy ${filterBy}` });

    const take = parseInt(pageSize) ?? 10;
    let skip = parseInt(page) ?? 1;
    skip -= 1;
    skip = skip * take;

    const filterInput: CartUserFilterInput = { filterBy, take, skip, sortField, sortOrder };

    return apiResponse._200(await getCartUsers(logger, filterInput));
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error when getting Cart users');
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getCartUsers = async (logger: Logger, filterInput: CartUserFilterInput) => {
  logger.Info({ message: `Getting Cart users` });

  try {
    const cartUser = await getCartUsersDb(logger, filterInput);
    return cartUser;
  } catch (err) {
    logger.Error(err);

    if (err instanceof UnAuthorizedError) throw err;
    if (err instanceof BadRequestError) throw err;
    throw new ApplicationError(err);
  }
};
