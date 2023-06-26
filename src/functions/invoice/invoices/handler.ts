import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { apiResponse } from '@common/apiResponse';
import { Logger } from '@common/logger';
import { INVOICE_SERVICE } from 'src/constants/commonConstants';
import MiddyWrapper from '@common/middyWrapper';
import { sendErrorResponse } from '@common/ErrorTypes';
import { getInvoicesHttp } from './getInvoices';

const invoices = async (event: APIGatewayProxyEvent, context: Context) => {
  const logger = new Logger(INVOICE_SERVICE, context.awsRequestId);
  const method = event.httpMethod;

  try {
    switch (method) {
      case 'GET':
        logger.Info({ message: 'Invoices GET method called' });
        return getInvoicesHttp(logger, event);
        break;
      default:
        return apiResponse._404({
          message: `method not found`,
        });
    }
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error in invoices');
  }
};

export const main = MiddyWrapper(invoices);
