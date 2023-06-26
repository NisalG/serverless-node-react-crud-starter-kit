import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { apiResponse } from '@common/apiResponse';
import { Logger } from '@common/logger';
import { ITEM_SERVICE } from 'src/constants/commonConstants';
import MiddyWrapper from '@common/middyWrapper';
import { sendErrorResponse } from '@common/ErrorTypes';
import { getItemsHttp } from './getItems';

const items = async (event: APIGatewayProxyEvent, context: Context) => {
  const logger = new Logger(ITEM_SERVICE, context.awsRequestId);
  const method = event.httpMethod;

  try {
    switch (method) {
      case 'GET':
        logger.Info({ message: 'Items GET method called' });
        return getItemsHttp(logger, event);
        break;
      default:
        return apiResponse._404({
          message: `method not found`,
        });
    }
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error in items');
  }
};

export const main = MiddyWrapper(items);
