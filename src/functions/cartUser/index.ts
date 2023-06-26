import { AWS } from '@serverless/typescript';
import { corsSettings } from '@functions/function.config';
import {
  AddCartUserSwaggerSchema,
  DeleteCartUserSwaggerSchema,
  GetCartUsersSwaggerSchema,
  GetCartUserByEmailSwaggerSchema,
  UpdateCartUserSwaggerSchema,
  GetCartUserByIdSwaggerSchema
} from './cartUser.swagger.schema';

export const cartUserFunctions: AWS['functions'] = {
  cartUsers: {
    handler: `src/functions/cartUser/cartUsers/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
    },
    events: [
      {
        http: {
          method: 'GET',
          path: 'v1/cartUsers',
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          //@ts-ignore
          ...GetCartUsersSwaggerSchema,
          request: {
            parameters: {
              querystrings: {
                page: true,
                pageSize: true,
                filterBy: false,
                sortField: false,
                sortOrder: false,
              },
            },
          },
        },
      },
      {
        http: {
          method: 'POST',
          path: 'v1/cartUser',
          cors: corsSettings,
          // authorizer: `cognitoAuthorizer`,
          // @ts-ignore
          ...AddCartUserSwaggerSchema,
        },
      },
    ],
  },
  cartUserById: {
    handler: `src/functions/cartUser/cartUserById/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
    },
    events: [
      {
        http: {
          method: 'GET',
          path: 'v1/cartUser/{cartUserId}',
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          //@ts-ignore
            ...GetCartUserByIdSwaggerSchema,
        },
      },
      {
        http: {
          method: 'PUT',
          path: 'v1/cartUser/{cartUserId}',
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          // @ts-ignore
          ...UpdateCartUserSwaggerSchema,
        },
      },
      {
        http: {
          method: 'DELETE',
          path: 'v1/cartUser/{cartUserId}',
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          request: {
            parameters: {
              querystrings: {},
            },
          },
          // @ts-ignore
          ...DeleteCartUserSwaggerSchema,
        },
      },
    ],
  },
  cartUserByEmail: {
    handler: `src/functions/cartUser/cartUserByEmail/handler.main`,
    events: [
      {
        http: {
          method: 'GET',
          path: 'v1/email/{email}/cartUser',
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          // @ts-ignore
          ...GetCartUserByEmailSwaggerSchema,
        },
      },
    ],
  },
};
