/* eslint-disable @typescript-eslint/no-explicit-any */
import { COGNITO_CLAIM, CART_ROLE } from "src/constants/cartConstants";
import {
  ApplicationError,
  BadRequestError,
  CustomUIError,
  UnAuthorizedError,
} from "@common/ErrorTypes";
import { Logger } from "@common/logger";
import { isAdmin } from "@common/services/role.service";
import { UserSchemaModel, MySQLDbCon, SQLDataSource } from "@data/mySQL";
import { User } from "@data/mySQL/models/user.schema.model";
import { In, Like, Not, QueryRunner } from "typeorm";
import {
  AddCartUserInput,
  CartUser,
  CartUserFilterInput,
} from "./cartUser.model";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { CognitoUserAttribute } from "@data/models/auth.model";
import {
  addCognitoUser,
  setUserPassword,
} from "@common/services/cognitoAuth.service";
import { APIGatewayEventDefaultAuthorizerContext } from "aws-lambda/common/api-gateway";

export const addUserValidations = async (
  logger: Logger,
  input: AddCartUserInput,
  claims: any
) => {
  const newCartUser = new UserSchemaModel();

  //  Enable below to enable only Admin users to create users
  // if (!isAdmin(claims) && claims[COGNITO_CLAIM.ROLE] !== input.role) {
  //   const err = new UnAuthorizedError(
  //     `User does not have permission ${input.role}`
  //   );
  //   logger.Error(err);
  //   throw err;
  // }

  return newCartUser;
};

export const deleteCartUserDb = async (
  logger: Logger,
  cartUserId: string,
  claims: any,
  deletedBy: string,
  queryRunner: QueryRunner
) => {
  logger.Info({ message: `Deleting User with id ${cartUserId}` });

  try {
    const existingUser = await queryRunner.manager.findOne(UserSchemaModel, {
      where: {
        id: cartUserId,
      },
    });

    if (!existingUser) {
      const err = new BadRequestError(
        `User with id ${cartUserId} does not exist`
      );
      logger.Error(err);
      throw err;
    }

    existingUser.deletedBy = deletedBy;

    await queryRunner.manager.save(existingUser);
    await queryRunner.manager.softDelete(UserSchemaModel, existingUser.id);

    return existingUser;
  } catch (err) {
    logger.Error(err);
    throw err;
  }
};

export const getCartUsersDb = async (
  logger: Logger,
  filterInput: CartUserFilterInput
) => {
  logger.Info({ message: `Getting Cart Users` });

  let limit = null;
  let skip = null;
  let filterBy = null;
  let sort = "updatedAt";
  let order: "ASC" | "DESC" = "DESC";

  if (filterInput) {
    limit = filterInput["take"] ?? limit;
    skip = filterInput["skip"] ?? skip;
    filterBy = filterInput["filterBy"] ?? filterBy;
    sort = filterInput["sortField"] ?? sort;
    order = filterInput["sortOrder"] ?? order;
  }

  await MySQLDbCon();

  const selectParams = [
    "User.id",
    "User.name",
    "User.email",
    "User.phone",
    "User.role",
  ];

  const cartUserRepo = SQLDataSource.getRepository(UserSchemaModel);

  const [cartUsers, cartUsersCount] = await cartUserRepo
    .createQueryBuilder("User")
    .select(selectParams)
    .take(limit)
    .skip(skip)
    .where({
      name: filterBy ? Like(`%${filterBy}%`) : Not(""),
    })
    .addOrderBy(sort, order)
    .getManyAndCount();

  return { cartUsers, cartUsersCount };
};

export const getCartUsersDbWithoutPagination = async (logger: Logger) => {
  logger.Info({
    message: `Getting Cart users without pagination`,
  });

  const sort = "name";
  const order = "ASC";

  await MySQLDbCon();

  const selectParams = [
    "User.id",
    "User.name",
    "User.email",
    "User.phone",
    "User.role",
  ];

  const cartUserRepo = SQLDataSource.getRepository(UserSchemaModel);

  const [cartUsers, cartUsersCount] = await cartUserRepo
    .createQueryBuilder("User")
    .select(selectParams)
    .addOrderBy(sort, order)
    .getMany();

  return { cartUsers, cartUsersCount };
};

export const getCartUsersFromEmails = async (
  logger: Logger,
  userEmails: string[]
) => {
  logger.Info({
    message: `Getting users by email`,
  });

  await MySQLDbCon();

  const cartUserRepo = SQLDataSource.getRepository(UserSchemaModel);
  const cartUsers: User[] = await cartUserRepo.find({
    select: {
      id: true,
      name: true,
      email: true,
    },
    where: {
      email: In(userEmails),
    },
  });

  return cartUsers;
};

export const getCartUserByEmail = (email: string, cartUsers: CartUser[]) => {
  return cartUsers.filter((cartUser) => cartUser.email === email)[0];
};

export const addCartUserToCognito = async (
  logger: Logger,
  cartUser: User,
  input: AddCartUserInput,
  cognitoIdentityServiceProvider: CognitoIdentityServiceProvider,
  userCreatedNotification = true
) => {
  logger.Info({
    message: `Adding user with email ${cartUser.email} to Cognito`,
  });

  try {
    const userAttributes: CognitoUserAttribute[] = [
      {
        Name: "name",
        Value: input.email,
      },
      {
        Name: "custom:role",
        Value: input.role ?? CART_ROLE.USER,
      },
      {
        Name: "custom:location",
        Value: input.location,
      },
      {
        Name: "email",
        Value: input.email,
      },
      {
        Name: "email_verified",
        Value: "true",
      },
    ];

    if (input.phone) {
      userAttributes.push({
        Name: "phone_number",
        Value: `+${input.phone}`,
      });
    }

    const cognitoUser = await addCognitoUser(
      cartUser,
      userAttributes,
      cognitoIdentityServiceProvider,
      userCreatedNotification
    );

    const adminSetUserPasswordRequest: CognitoIdentityServiceProvider.AdminSetUserPasswordRequest =
      {
        Password: input.password,
        Permanent: true, //User not needed to change the password at the first login 
        Username: input.email,
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
      };

    await setUserPassword(
      logger,
      adminSetUserPasswordRequest,
      cognitoIdentityServiceProvider
    );

    return cognitoUser;
  } catch (err) {
    logger.Error(err);

    if (err.code === "InvalidPasswordException") {
      throw new BadRequestError(err.message);
    }
    if (err.code === "UsernameExistsException") {
      throw new CustomUIError("A user with same name already exist");
    }
    if (err instanceof UnAuthorizedError) throw err;
    if (err instanceof BadRequestError) throw err;

    throw new ApplicationError(err);
  }
};

export const addCartUser = async (
  logger: Logger,
  input: AddCartUserInput,
  claims: APIGatewayEventDefaultAuthorizerContext
) => {
  logger.Info({ message: `Adding cart user from http` });

  const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18",
    region: "us-east-1",
  });
  await MySQLDbCon();
  const queryRunner = SQLDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    if (!claims) {
      const err = new UnAuthorizedError(`No claims are present in the token`);
      logger.Error(err);
      throw err;
    }
    // console.log('claims::::::::', claims);
    /**
    claims:::::::: {
      claims: undefined,
      scopes: undefined,
      principalId: 'offlineContext_authorizer_principalId'
    }
  */

    //  Enable below to enable only Admin users to create users
    // if (!isAdmin(claims)) {
    //   const err = new UnAuthorizedError(`User is not authorized to add users`);
    //   logger.Error(err);
    //   throw err;
    // }
    // const createdBy = claims[COGNITO_CLAIM.EMAIL];

    const createdBy = input.email;

    const existingUser = await queryRunner.manager.findOne(UserSchemaModel, {
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      const err = new BadRequestError(
        `User with email ${input.email} already exists`
      );
      logger.Error(err);
      throw err;
    }
    const newCartUser = await addUserValidations(logger, input, claims);
    newCartUser.email = input.email;
    newCartUser.location = input.location;
    newCartUser.createdBy = createdBy;
    newCartUser.name = input.name;
    newCartUser.phone = input.phone;
    newCartUser.role = input.role;
    newCartUser.updatedBy = "";
    newCartUser.deletedBy = "";

    const cartUser = await queryRunner.manager.save(newCartUser);
    await queryRunner.commitTransaction();

    const cognitoUser = await addCartUserToCognito(
      logger,
      cartUser,
      input,
      cognitoIdentityServiceProvider
    );

    return cognitoUser;
  } catch (err) {
    logger.Error(err);

    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};
