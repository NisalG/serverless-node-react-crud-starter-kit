import { apiResponse } from '@common/apiResponse';
import { sendErrorResponse, UnAuthorizedError } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
// import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { deleteItemDb } from '../item.service';
import { MySQLDbCon, SQLDataSource } from '@data/mySQL';
import { COGNITO_CLAIM } from '../../../../src/constants/authConstants';

export const deleteItemHttp = async (logger: Logger, event: APIGatewayProxyEvent) => {
  try {
    const { id } = event.pathParameters;
    logger.Info({ message: `Deleting item with id ${id}` });

    const claims = event.requestContext.authorizer ?? event.requestContext.authorizer.claims;
    const deletedBy = claims[COGNITO_CLAIM.EMAIL];
    // const deletedBy = 'admin';

    await deleteItem(logger, id, deletedBy);

    return apiResponse._200({ id });
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error when deleting item');
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteItem = async (
  logger: Logger,
  id: string,
  deletedBy: string,
) => {

  await MySQLDbCon();
  const queryRunner = SQLDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const item = await deleteItemDb(logger, id, deletedBy, queryRunner);

    await queryRunner.commitTransaction();
    return item;
  } catch (err) {
    logger.Error(err);
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};
