import { BadRequest, InternalServerError } from 'src/types/commonSwagger';

export const AddCartUserSwaggerSchema = {
  bodyType: 'AddCartUserInputSwagger',
  swaggerTags: ['Cart User'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'CreateCartUserSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const UpdateCartUserSwaggerSchema = {
  bodyType: 'UpdateCartUserInputSwagger',
  swaggerTags: ['Cart User'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'CreateCartUserSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const DeleteCartUserSwaggerSchema = {
  swaggerTags: ['Cart User'],
  responseData: {
    200: {
      description: 'User Deleted',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const GetCartUsersSwaggerSchema = {
  swaggerTags: ['Cart User'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'GetCartUsersSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const GetCartUserByIdSwaggerSchema = {
  swaggerTags: ['Cart User'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'GetCartUserSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const GetCartUserByEmailSwaggerSchema = {
  swaggerTags: ['Cart User'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'GetCartUserSuccess',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};
