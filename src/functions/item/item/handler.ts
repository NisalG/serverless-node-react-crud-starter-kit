import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { apiResponse } from '@common/apiResponse';
import { Logger } from '@common/logger';
import { ITEM_SERVICE } from '../../../../src/constants/commonConstants';
import MiddyWrapper from '@common/middyWrapper';
import { sendErrorResponse } from '@common/ErrorTypes';
// import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { deleteItemHttp } from './deleteItem';
import { updateItemHttp } from './updateItem';
import { getItemHttp } from './getItem';
import { addItemHttp } from '../item/addItem';

const itemById = async (event: APIGatewayProxyEvent, context: Context) => {
  const logger = new Logger(ITEM_SERVICE, context.awsRequestId);
  const method = event.httpMethod;

  // const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({ apiVersion: '2016-04-18', region: 'us-east-1' });

  try {
    switch (method) {
      case 'GET':
        logger.Info({ message: 'ItemById GET method called' });
        return await getItemHttp(logger, event);
      case 'POST':
        logger.Info({ message: 'Items POST method called' });
        return await addItemHttp(logger, event);
      case 'PUT':
        logger.Info({ message: 'Update Items PUT method called' });
        return await updateItemHttp(logger, event);
      case 'DELETE':
        logger.Info({ message: 'ItemById DELETE method called' });
        return await deleteItemHttp(logger, event);
      default:
        return apiResponse._404({
          message: `Method not found`,
        });
    }
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error on ItemById');
  }
};

export const main = MiddyWrapper(itemById);
