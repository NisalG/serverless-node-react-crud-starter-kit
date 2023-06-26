import { BadRequest, InternalServerError } from '../../types/commonSwagger';

export const GetCognitoRefreshTokenSwaggerSchema = {
  bodyType: 'AuthenticateCognitoUserInput',
  swaggerTags: ['Authentication'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'CognitoSessionTokensResponse',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const RefreshCognitoSessionSwaggerSchema = {
  bodyType: 'RefreshCognitoSessionInput',
  swaggerTags: ['Authentication'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'CognitoSessionTokensResponse',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};

export const ResetPasswordCognitoSwaggerSchema = {
  bodyType: 'ResetPasswordInput',
  swaggerTags: ['Authentication'],
  responseData: {
    200: {
      description: 'Success',
      bodyType: 'CognitoSessionTokensResponse',
    },
    400: BadRequest,
    500: InternalServerError,
  },
};
