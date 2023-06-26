import { apiResponse } from '@common/apiResponse';
import { COGNITO_CLAIM, CART_ROLE } from 'src/constants/cartConstants';
import { ApplicationError, BadRequestError, sendErrorResponse, UnAuthorizedError } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { User } from '@data/mySQL/models/user.schema.model';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { UpdateCartUserInput } from '../cartUser.model';
import { updateAttributesOfCognitoUser } from '@common/services/cognitoAuth.service';
import { CognitoUserAttribute } from '@data/models/auth.model';
import { isAdmin } from '@common/services/role.service';
import { UserSchemaModel, MySQLDbCon, SQLDataSource } from '@data/mySQL';

export const updateCartUserHttp = async (logger: Logger, event: APIGatewayProxyEvent, cognitoIdentityServiceProvider: CognitoIdentityServiceProvider) => {
  logger.Info({ message: `Updating cart user from http` });

  await MySQLDbCon();
  const queryRunner = SQLDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const { cartUserId } = event.pathParameters;
    //@ts-ignore
    const input: UpdateCartUserInput = event.body;
    const claims = event.requestContext?.authorizer ?? event.requestContext?.authorizer?.claims;
    input.id = cartUserId;

    if (!claims) {
      const err = new UnAuthorizedError(`No claims are present in the token`);
      logger.Error(err);
      throw err;
    }

    if (!isAdmin(claims)) {
      const err = new UnAuthorizedError(`User is not authorized to update users`);
      logger.Error(err);
      throw err;
    }

    const existingUser = await queryRunner.manager.findOne(UserSchemaModel, {
      where: {
        id: input.id,
      }
    });

    if (!existingUser) {
      const err = new BadRequestError(`User with id ${input.id} not exists`);
      logger.Error(err);
      throw err;
    }

    const updatedBy = claims[COGNITO_CLAIM.EMAIL];

    logger.Info({ message: `Updating Cart User with id ${input.id} ` });

    existingUser.location = input.location;
    existingUser.updatedBy = updatedBy;
    existingUser.name = input.name;
    existingUser.phone = input.phone;
    existingUser.role = input.role;

    const cartUser = await queryRunner.manager.save(existingUser);

    await updateCartUserToCognito(logger, cartUser, input, cognitoIdentityServiceProvider);

    await queryRunner.commitTransaction();

    return apiResponse._200({ cartUser });
    //TODO Add to all teams
  } catch (err) {
    logger.Error(err);

    await queryRunner.rollbackTransaction();

    return sendErrorResponse(err, logger, 'Error when Updating Cart user');
  } finally {
    await queryRunner.release();
  }
};

export const updateCartUserToCognito = async (logger: Logger, cartUser: User, input: UpdateCartUserInput, cognitoIdentityServiceProvider: CognitoIdentityServiceProvider) => {
  logger.Info({ message: `Updating user with email ${cartUser.email} to Cognito` });

  try {
    const userAttributes: CognitoUserAttribute[] = [
      {
        Name: 'name',
        Value: `${input.name}`,
      },
      {
        Name: 'custom:role',
        Value: input.role ?? CART_ROLE.USER,
      },
      {
        Name: 'custom:location',
        Value: input.location,
      },
    ];

    if (input.phone) {
      userAttributes.push({
        Name: 'phone_number',
        Value: `+${input.phone}`,
      });
    }

    await updateAttributesOfCognitoUser(cartUser, userAttributes, cognitoIdentityServiceProvider);
  } catch (err) {
    logger.Error(err);

    if (err instanceof UnAuthorizedError) throw err;
    if (err instanceof BadRequestError) throw err;

    throw new ApplicationError(err);
  }
};
