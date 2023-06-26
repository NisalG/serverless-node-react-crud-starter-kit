import { apiResponse } from "@common/apiResponse";
import { BadRequestError, sendErrorResponse } from "@common/ErrorTypes";
import { Logger } from "@common/logger";
import { UserSchemaModel, MySQLDbCon, SQLDataSource } from "@data/mySQL";
import { APIGatewayProxyEvent } from "aws-lambda";
import { GetCartUserProfile } from "../cartUser.model";

export const getCartUser = async (
  logger: Logger,
  event: APIGatewayProxyEvent
) => {
  logger.Info({ message: `Getting cart user` });

  await MySQLDbCon();

  try {
    const { email } = event.pathParameters;

    const cartUserRepo = SQLDataSource.getRepository(UserSchemaModel);
    const existingUser = await cartUserRepo.findOne({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
      },
    });

    if (!existingUser) {
      const error = new BadRequestError(`User with email ${email} not exists`);
      logger.Error(error);
      throw error;
    }

    const cartUser: GetCartUserProfile = {
      id: existingUser?.id,
      name: existingUser?.name,
      phone: existingUser?.phone,
      email: existingUser?.email
    };

    return apiResponse._200({ cartUser });
  } catch (error) {
    logger.Error(error);
    return sendErrorResponse(error, logger, "Error when Getting Cart user");
  }
};
