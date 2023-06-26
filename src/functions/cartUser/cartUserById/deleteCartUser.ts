import { apiResponse } from "@common/apiResponse";
import { COGNITO_CLAIM } from "src/constants/cartConstants";
import { sendErrorResponse, UnAuthorizedError } from "@common/ErrorTypes";
import { Logger } from "@common/logger";
import { isAdmin } from "@common/services/role.service";
import { APIGatewayProxyEvent } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { deleteCartUserDb } from "../cartUser.service";
import { deleteUserFromCognitoPool } from "@common/services/cognitoAuth.service";
import { MySQLDbCon, SQLDataSource } from "@data/mySQL";

export const deleteCartUserHttp = async (
  logger: Logger,
  event: APIGatewayProxyEvent,
  cognitoIdentityServiceProvider: CognitoIdentityServiceProvider
) => {
  try {
    const { cartUserId } = event.pathParameters;

    const claims =
      event.requestContext.authorizer ?? event.requestContext.authorizer.claims;

    if (!isAdmin(claims)) {
      const err = new UnAuthorizedError(
        `User is not authorized to delete users`
      );
      logger.Error(err);
      throw err;
    }

    const deletedBy = claims[COGNITO_CLAIM.EMAIL];

    await deleteCartUser(
      logger,
      cartUserId,
      claims,
      deletedBy,
      cognitoIdentityServiceProvider
    );

    //TODO Remove from all teams

    return apiResponse._200({ deletedBy });
  } catch (err) {
    logger.Error(err);
    return sendErrorResponse(err, logger, "Error when deleting a Cart user");
  }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteCartUser = async (
  logger: Logger,
  cartUserId: string,
  claims: any,
  deletedBy: string,
  cognitoIdentityServiceProvider: CognitoIdentityServiceProvider
) => {
  logger.Info({ message: `Deleting user with id ${cartUserId} from Cognito` });

  await MySQLDbCon();
  const queryRunner = SQLDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const cartUser = await deleteCartUserDb(
      logger,
      cartUserId,
      claims,
      deletedBy,
      queryRunner
    );
    const cartCognitoUser = await deleteUserFromCognitoPool(
      logger,
      cartUser.email,
      cognitoIdentityServiceProvider
    );

    await queryRunner.commitTransaction();
    return cartCognitoUser;
  } catch (err) {
    logger.Error(err);
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};
