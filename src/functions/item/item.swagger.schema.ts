import { BadRequest, InternalServerError } from 'src/types/commonSwagger';

export const GetItemsSwaggerSchema = {
  swaggerTags: ['Item'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'GetItemsSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const GetItemSwaggerSchema = {
  swaggerTags: ['Item'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'GetItemSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const AddItemSwaggerSchema = {
  bodyType: 'AddItemInput',
  swaggerTags: ['Item'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'CreateItemSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const UpdateItemSwaggerSchema = {
  bodyType: 'UpdateItemInputForSwagger',
  swaggerTags: ['Item'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'CreateItemSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const DeleteItemSwaggerSchema = {
  swaggerTags: ['Item'],
  responseData: {
    200: {
      description: 'Item Deleted',
      bodyType: 'DeleteItemSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};