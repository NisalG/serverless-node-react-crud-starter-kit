import { apiResponse } from '@common/apiResponse';
import { BadRequestError, sendErrorResponse, UnAuthorizedError } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { isAdmin } from '@common/services/role.service';
import { UserSchemaModel, MySQLDbCon, SQLDataSource } from '@data/mySQL';
import { GetCartUserInput } from '../cartUser.model';

export const getCartUserHttp = async (logger: Logger, event: APIGatewayProxyEvent) => {
  logger.Info({ message: `Getting cart user from http` });

  await MySQLDbCon();

  try {
    const { cartUserId } = event.pathParameters;
    const claims = event.requestContext?.authorizer ?? event.requestContext?.authorizer?.claims;

    if (!claims) {
      const err = new UnAuthorizedError(`No claims are present in the token`);
      logger.Error(err);
      throw err;
    }

    if (isAdmin(claims)) {
      const err = new UnAuthorizedError(`User is not authorized to add users to the site`);
      logger.Error(err);
      throw err;
    }

    const cartUserRepo = SQLDataSource.getRepository(UserSchemaModel);

    const existingUser = await cartUserRepo.findOne({
      where: {
        id: cartUserId,
      }
    });

    if (!existingUser) {
      const err = new BadRequestError(`User with id ${cartUserId} not exists`);
      logger.Error(err);
      throw err;
    }

    const cartUser: GetCartUserInput = {
      id: existingUser.id,
      name: existingUser.name,
      location: existingUser.location,
      phone: existingUser.phone,
      role: existingUser.role,
      email: existingUser.email,
    };

    return apiResponse._200({ cartUser });
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, 'Error when Getting Cart user');
  }
};
