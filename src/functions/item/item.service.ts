/* eslint-disable @typescript-eslint/no-explicit-any */
import { COGNITO_CLAIM } from "../../../src/constants/cartConstants";
import {
  ApplicationError,
  BadRequestError,
  CustomUIError,
  UnAuthorizedError,
} from "@common/ErrorTypes";
import { Logger } from "@common/logger";
import { ItemSchemaModel, MySQLDbCon, SQLDataSource } from "@data/mySQL";
import { In, Like, Not, QueryRunner } from "typeorm";
import { AddItemInput, GetItemOutput, UpdateItemInput } from "./item.model";
import { ItemFilterInput } from "./item.model";
// import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { APIGatewayEventDefaultAuthorizerContext } from "aws-lambda/common/api-gateway";

export const addItem = async (
  logger: Logger,
  addItemInput: AddItemInput,
  claims: APIGatewayEventDefaultAuthorizerContext
) => {
  logger.Info({ message: `Adding Item` });

  await MySQLDbCon();
  const queryRunner = SQLDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const createdBy = claims[COGNITO_CLAIM.EMAIL];
    // const createdBy = "ADMIN";
    // const item = await saveItemDb(
    //   logger,
    //   addItemInput,
    //   createdBy,
    //   queryRunner
    // );

    const newItem = new ItemSchemaModel();
    newItem.name = addItemInput.name;
    newItem.description = addItemInput.description;
    newItem.price = addItemInput.price;
    newItem.createdBy = createdBy;
    newItem.updatedBy = "";
    newItem.deletedBy = "";

    await queryRunner.manager.save(newItem);

    await queryRunner.commitTransaction();

    return addItemInput;
  } catch (err) {
    logger.Error(err);
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
};

export const getItemsDb = async (
  logger: Logger,
  filterInput: ItemFilterInput
) => {
  logger.Info({ message: `Getting All Items paginated` });

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
    "ItemSchemaModel.id",
    "ItemSchemaModel.name",
    "ItemSchemaModel.description",
    "ItemSchemaModel.price",
  ];

  const itemRepo = SQLDataSource.getRepository(ItemSchemaModel);

  const [items, itemsCount] = await itemRepo
    .createQueryBuilder("ItemSchemaModel")
    .select(selectParams)
    .take(limit)
    .skip(skip)
    .where({
      name: filterBy ? Like(`%${filterBy}%`) : Not(""),
    })
    .addOrderBy(sort, order)
    .getManyAndCount();

  return { items, itemsCount };
};

export const getItemDb = async (logger: Logger, id: string) => {
  logger.Info({ message: `Getting an Item by Id:${id}` });
  await MySQLDbCon();

  try {
    const itemRepo = SQLDataSource.getRepository(ItemSchemaModel);

    const existingItem = await itemRepo.findOne({
      where: {
        id,
      },
    });

    if (!existingItem) {
      const err = new BadRequestError(`Item with id ${id} not exists`);
      logger.Error(err);
      throw err;
    }

    const item: GetItemOutput = {
      id: existingItem.id,
      name: existingItem.name,
      description: existingItem.description,
      price: existingItem.price,
    };

    return item;
  } catch (err) {
    logger.Error(err);
    throw err;
  }
};

export const updateItemDb = async (
  logger: Logger,
  updateItemInput: UpdateItemInput,
  claims: APIGatewayEventDefaultAuthorizerContext
) => {
  logger.Info({ message: `Updating Item with id ${updateItemInput.id} ` });

  const updatedBy = claims[COGNITO_CLAIM.EMAIL];
  // const updatedBy = "admin";

  await MySQLDbCon();
  const queryRunner = SQLDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const existingItem = await queryRunner.manager.findOne(ItemSchemaModel, {
      where: {
        id: updateItemInput.id,
      },
    });

    if (!existingItem) {
      const err = new BadRequestError(
        `Item with id ${updateItemInput.id} not exists`
      );
      logger.Error(err);
      throw err;
    }

    existingItem.name = updateItemInput.name ?? existingItem.name;
    existingItem.description =
      updateItemInput.description ?? existingItem.description;
    existingItem.price = updateItemInput.price ?? existingItem.price;
    existingItem.updatedBy = updatedBy;

    /**
     * Repo.save() can also be used here easily. But used QueryRunner to show its usage.
     * Repo has been used in querying.
     */

    await queryRunner.manager.save(existingItem);

    await queryRunner.commitTransaction();

    return existingItem;
  } catch (err) {
    await queryRunner.rollbackTransaction();

    logger.Error(err);
    throw err;
  } finally {
    await queryRunner.release();
  }
};

export const deleteItemDb = async (
  logger: Logger,
  id: string,
  deletedBy: string,
  queryRunner: QueryRunner
) => {
  logger.Info({ message: `Deleting Item with id ${id}` });

  try {
    const existingItem = await queryRunner.manager.findOne(ItemSchemaModel, {
      where: {
        id,
      },
    });

    if (!existingItem) {
      const err = new BadRequestError(`Item with id ${id} does not exist`);
      logger.Error(err);
      throw err;
    }

    existingItem.deletedBy = deletedBy;

    await queryRunner.manager.save(existingItem);
    await queryRunner.manager.softDelete(ItemSchemaModel, existingItem.id);

    return existingItem;
  } catch (err) {
    logger.Error(err);
    throw err;
  }
};
