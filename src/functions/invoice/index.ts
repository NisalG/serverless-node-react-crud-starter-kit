import { AWS } from "@serverless/typescript";
import { corsSettings } from "@functions/function.config";
import {
  GetInvoiceSwaggerSchema,
  GetInvoicesSwaggerSchema,
  AddInvoiceSwaggerSchema,
  UpdateInvoiceSwaggerSchema,
  DeleteInvoiceSwaggerSchema,
} from "./invoice.swagger.schema";

export const invoiceFunctions: AWS["functions"] = {
  invoices: {
    handler: `src/functions/invoice/invoices/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
      COGNITO_CLIENT_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolClientId}',
    },
    events: [
      {
        http: {
          method: "GET",
          path: "v1/invoices",
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          //@ts-ignore
          ...GetInvoicesSwaggerSchema,
          request: {
            parameters: {
              querystrings: {
                page: true,
                pageSize: true,
              },
            },
          },
        },
      },
    ],
  },
  invoice: {
    handler: `src/functions/invoice/invoice/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
      COGNITO_CLIENT_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolClientId}',
    },
    events: [
      {
        http: {
          method: "GET",
          path: "v1/invoice/{id}",
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          //@ts-ignore
            ...GetInvoiceSwaggerSchema,
        },
      },
      {
        http: {
          method: "POST",
          path: "v1/invoice",
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          // @ts-ignore
          ...AddInvoiceSwaggerSchema,
        },
      },
      {
        http: {
          method: "PUT",
          path: "v1/invoice/{id}",
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          // @ts-ignore
          ...UpdateInvoiceSwaggerSchema,
        },
      },
      {
        http: {
          method: "DELETE",
          path: "v1/invoice/{id}",
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          request: {
            parameters: {
              querystrings: {
              },
            },
          },
          // @ts-ignore
          ...DeleteInvoiceSwaggerSchema,
        },
      },
    ],
  },
};
