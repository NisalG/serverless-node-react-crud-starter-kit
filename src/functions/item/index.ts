import { AWS } from "@serverless/typescript";
import { corsSettings } from "@functions/function.config";
import {
  GetItemSwaggerSchema,
  GetItemsSwaggerSchema,
  AddItemSwaggerSchema,
  UpdateItemSwaggerSchema,
  DeleteItemSwaggerSchema,
} from "./item.swagger.schema";

export const itemFunctions: AWS["functions"] = {
  items: {
    handler: `src/functions/item/items/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
      COGNITO_CLIENT_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolClientId}',
    },
    events: [
      {
        http: {
          method: "GET",
          path: "v1/items",
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          //@ts-ignore
          ...GetItemsSwaggerSchema,
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
    ],
  },
  item: {
    handler: `src/functions/item/item/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
      COGNITO_CLIENT_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolClientId}',
    },
    events: [
      {
        http: {
          method: "GET",
          path: "v1/item/{id}",
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          //@ts-ignore
            ...GetItemSwaggerSchema,
        },
      },
      {
        http: {
          method: "POST",
          path: "v1/item",
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          // @ts-ignore
          ...AddItemSwaggerSchema,
        },
      },
      {
        http: {
          method: "PUT",
          path: "v1/item/{id}",
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          // @ts-ignore
          ...UpdateItemSwaggerSchema,
        },
      },
      {
        http: {
          method: "DELETE",
          path: "v1/item/{id}",
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          request: {
            parameters: {
              querystrings: {
              },
            },
          },
          // @ts-ignore
          ...DeleteItemSwaggerSchema,
        },
      },
    ],
  },
};
