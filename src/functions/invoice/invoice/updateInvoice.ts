import { apiResponse } from '@common/apiResponse';
import { BadRequestError, sendErrorResponse, UnAuthorizedError } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
// import { COGNITO_CLAIM } from '@common/constants';
// import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { UpdateInvoiceInput } from '../invoice.model';
// import { InvoiceModelSchema, MySQLDbCon, SQLDataSource } from '@data/mySQL';
import { updateInvoiceDb } from '../invoice.service';
// import { In } from 'typeorm';

export const updateInvoiceHttp = async (logger: Logger, event: APIGatewayProxyEvent) => {
  logger.Info({ message: `Updating Invoice` });

  try {
    const { id } = event.pathParameters;
    //@ts-ignore
    const updateInvoiceInput: UpdateInvoiceInput = event.body;
    const claims = event.requestContext?.authorizer ?? event.requestContext?.authorizer?.claims;
    // input.id = id;

    // if (!claims) {
    //   const err = new UnAuthorizedError(`No claims are present in the token`);
    //   logger.Error(err);
    //   throw err;
    // }


    await updateInvoiceDb(logger, id, updateInvoiceInput, claims);

    return apiResponse._200({ id });
    //TODO Add to all teams
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error when Updating Invoice');
  }
};