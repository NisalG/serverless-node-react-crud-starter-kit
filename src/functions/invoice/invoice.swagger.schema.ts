import { BadRequest, InternalServerError } from 'src/types/commonSwagger';

export const GetInvoicesSwaggerSchema = {
  swaggerTags: ['Invoice'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'GetInvoicesSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const GetInvoiceSwaggerSchema = {
  swaggerTags: ['Invoice'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'GetInvoiceSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const AddInvoiceSwaggerSchema = {
  bodyType: 'AddInvoiceInput',
  swaggerTags: ['Invoice'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'CreateInvoiceSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const UpdateInvoiceSwaggerSchema = {
  bodyType: 'UpdateInvoiceInput',
  swaggerTags: ['Invoice'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'CreateInvoiceSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const DeleteInvoiceSwaggerSchema = {
  swaggerTags: ['Invoice'],
  responseData: {
    200: {
      description: 'Invoice Deleted',
      bodyType: 'DeleteInvoiceSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};