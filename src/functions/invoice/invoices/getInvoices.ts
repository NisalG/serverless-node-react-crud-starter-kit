import { apiResponse } from '@common/apiResponse';
import { ApplicationError, BadRequestError, sendErrorResponse, UnAuthorizedError } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getInvoicesDb } from '../invoice.service';

export const getInvoicesHttp = async (logger: Logger, event: APIGatewayProxyEvent) => {
  try {

    return apiResponse._200(await getInvoices(logger, event));
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error when getting Invoices');
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getInvoices = async (logger: Logger, event: APIGatewayProxyEvent) => {
  logger.Info({ message: `Getting Invoices with pagination` });

  try {
    const invoices = await getInvoicesDb(logger, event);
    return invoices;
  } catch (err) {
    logger.Error(err);

    if (err instanceof UnAuthorizedError) throw err;
    if (err instanceof BadRequestError) throw err;
    throw new ApplicationError(err);
  }
};
