import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { apiResponse } from '@common/apiResponse';
import { Logger } from '@common/logger';
import { INVOICE_SERVICE } from 'src/constants/commonConstants';
import MiddyWrapper from '@common/middyWrapper';
import { sendErrorResponse } from '@common/ErrorTypes';
// import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { deleteInvoiceHttp } from './deleteInvoice';
import { updateInvoiceHttp } from './updateInvoice';
import { getInvoiceHttp } from './getInvoice';
import { addInvoiceHttp } from '../invoice/addInvoice';

const invoiceById = async (event: APIGatewayProxyEvent, context: Context) => {
  const logger = new Logger(INVOICE_SERVICE, context.awsRequestId);
  const method = event.httpMethod;

  // const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-18', region: 'us-east-1' });

  try {
    switch (method) {
      case 'GET':
        logger.Info({ message: 'InvoiceById GET method called' });
        return getInvoiceHttp(logger, event);
      case 'POST':
        logger.Info({ message: 'Invoices POST method called' });
        return await addInvoiceHttp(logger, event);
      case 'PUT':
        logger.Info({ message: 'Update Invoices PUT method called' });
        return updateInvoiceHttp(logger, event);
      case 'DELETE':
        logger.Info({ message: 'InvoiceById DELETE method called' });
        return deleteInvoiceHttp(logger, event);
      default:
        return apiResponse._404({
          message: `Method not found`,
        });
    }
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error on InvoiceById');
  }
};

export const main = MiddyWrapper(invoiceById);
