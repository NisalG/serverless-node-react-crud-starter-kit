import { apiResponse } from '@common/apiResponse';
import { sendErrorResponse, UnAuthorizedError } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
// import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { deleteInvoiceDb } from '../invoice.service';
import { COGNITO_CLAIM } from 'src/constants/authConstants';

export const deleteInvoiceHttp = async (logger: Logger, event: APIGatewayProxyEvent) => {
  try {
    const { id } = event.pathParameters;
    logger.Info({ message: `Deleting invoice with id ${id}` });

    const claims = event.requestContext.authorizer ?? event.requestContext.authorizer.claims;
    const deletedBy = claims[COGNITO_CLAIM.EMAIL];
    // const deletedBy = 'admin';

    await deleteInvoiceDb(logger, id, deletedBy);

    return apiResponse._200({ id });
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error when deleting invoice');
  }
};
