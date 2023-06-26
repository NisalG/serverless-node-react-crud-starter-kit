/* eslint-disable @typescript-eslint/no-explicit-any */
import { COGNITO_CLAIM } from "src/constants/authConstants";
import {
  ApplicationError,
  BadRequestError,
  CustomUIError,
  UnAuthorizedError,
} from "@common/ErrorTypes";
import { Logger } from "@common/logger";
import { InvoiceModelSchema, MongoDbCon } from "@data/mongoDB";
import {
  AddInvoiceInput,
  GetInvoiceOutput,
  UpdateInvoiceInput,
} from "./invoice.model";
// import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { APIGatewayEventDefaultAuthorizerContext } from "aws-lambda/common/api-gateway";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Invoice, InvoiceQueryParam } from "@data/models/invoice.model";
import { auditLog } from "@common/services/auditLog.service";
import { AuditType } from "@data/models/auditLog.model";

export const addInvoice = async (
  logger: Logger,
  addInvoiceInput: AddInvoiceInput,
  claims: APIGatewayEventDefaultAuthorizerContext
) => {
  logger.Info({ message: `Adding Invoice` });

  const uri = process.env.MONGODB_URL;
  await MongoDbCon(uri);

  try {
    const createdBy = claims[COGNITO_CLAIM.EMAIL];
    // const createdBy = "admin";

    const newInvoice = new InvoiceModelSchema(addInvoiceInput);
    newInvoice.items = addInvoiceInput.items;
    newInvoice.total = addInvoiceInput.total;
    newInvoice.customerEmail = addInvoiceInput.customerEmail;
    newInvoice.customerPhone = addInvoiceInput.customerPhone;
    newInvoice.createdBy = createdBy;
    newInvoice.updatedBy = "";
    newInvoice.deletedBy = "";

    const addedInvoice = await newInvoice.save();

    // Send Push Notification

    // Send to SQS

    auditLog({
      auditType: AuditType.INVOICE_ADD,
      oldValue: "",
      newValue: addedInvoice,
      modifiedBy: createdBy,
      invoiceId: addedInvoice.id,
    });

    return addedInvoice;
  } catch (err) {
    logger.Error(err);
    throw err;
  }
};

export const getInvoicesDb = async (
  logger: Logger,
  event: APIGatewayProxyEvent
) => {
  logger.Info({ message: `Getting Invoices DB service` });

  const { pageSize, page } =
    event.queryStringParameters as unknown as InvoiceQueryParam;
  const paged = page - 1;

  const uri = process.env.MONGODB_URL;
  await MongoDbCon(uri);

  const invoices: Invoice[] = await InvoiceModelSchema.find()
    // .where({ deletedBy: null }) // only null is check
    // .where({deletedBy: {$exists: false}}) //only exist is check
    .where({ deletedBy: { $in: [null, ""] } }) // check both
    .skip(paged * pageSize)
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .lean();

  return { invoices };
};

export const getInvoiceDb = async (logger: Logger, id: string) => {
  logger.Info({ message: `Getting an Invoice by Id:${id}` });

  const uri = process.env.MONGODB_URL;
  await MongoDbCon(uri);

  try {
    const existingInvoice = InvoiceModelSchema.findOne({ _id: id }).lean();

    if (!existingInvoice) {
      const err = new BadRequestError(`Invoice with id ${id} not exists`);
      logger.Error(err);
      throw err;
    }

    return existingInvoice;
  } catch (err) {
    logger.Error(err);
    throw err;
  }
};

export const updateInvoiceDb = async (
  logger: Logger,
  id: string,
  updateInvoiceInput: UpdateInvoiceInput,
  claims: APIGatewayEventDefaultAuthorizerContext
) => {
  logger.Info({
    message: `Updating Invoice with id ${id} `,
  });

  const updatedBy = claims[COGNITO_CLAIM.EMAIL];
  // const updatedBy = "admin";

  const uri = process.env.MONGODB_URL;
  await MongoDbCon(uri);

  try {
    const existingInvoice = await InvoiceModelSchema.findOne({
      _id: id,
    }).lean();

    if (!existingInvoice) {
      const err = new BadRequestError(`Invoice with id ${id} not exists`);
      logger.Error(err);
      throw err;
    }

    existingInvoice.items = updateInvoiceInput.items ?? existingInvoice.items;
    existingInvoice.total = updateInvoiceInput.total ?? existingInvoice.total;
    existingInvoice.customerEmail =
      updateInvoiceInput.customerEmail ?? existingInvoice.customerEmail;
    existingInvoice.customerPhone =
      updateInvoiceInput.customerPhone ?? existingInvoice.customerPhone;
    existingInvoice.updatedBy = updatedBy;

    const updatedInvoice = await InvoiceModelSchema.updateOne(
      {
        _id: id,
      },
      existingInvoice
    );

    //Add record to Audit log

    auditLog({
      auditType: AuditType.INVOICE_EDIT,
      oldValue: existingInvoice,
      newValue: updatedInvoice,
      modifiedBy: updatedBy,
      invoiceId: id,
    });

    return existingInvoice;
  } catch (err) {
    logger.Error(err);
    throw err;
  }
};

export const deleteInvoiceDb = async (
  logger: Logger,
  id: string,
  deletedBy: string
) => {
  logger.Info({ message: `Deleting Invoice with id ${id}` });

  const uri = process.env.MONGODB_URL;
  await MongoDbCon(uri);

  try {
    const existingInvoice = await InvoiceModelSchema.findOne({
      _id: id,
    }).lean();

    if (!existingInvoice) {
      const err = new BadRequestError(`Invoice with id ${id} not exists`);
      logger.Error(err);
      throw err;
    }

    existingInvoice.deletedBy = deletedBy;

    const updatedInvoice = await InvoiceModelSchema.updateOne(
      {
        _id: id,
      },
      existingInvoice
    );

    //Add record to Audit log
    auditLog({
      auditType: AuditType.INVOICE_DELETE,
      oldValue: existingInvoice,
      newValue: updatedInvoice,
      modifiedBy: deletedBy,
      invoiceId: id,
    });

    return existingInvoice;
  } catch (err) {
    logger.Error(err);
    throw err;
  }
};
