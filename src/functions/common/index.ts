import { AWS } from "@serverless/typescript";
import { corsSettings } from "@functions/function.config";
// import {
//   GetInvoiceSwaggerSchema,
//   GetInvoicesSwaggerSchema,
//   AddInvoiceSwaggerSchema,
//   UpdateInvoiceSwaggerSchema,
//   DeleteInvoiceSwaggerSchema,
// } from "./invoice.swagger.schema";

export const commonFunctions: AWS["functions"] = {
  sendEmails: {
    handler: `src/functions/common/sendEmails/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
      COGNITO_CLIENT_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolClientId}',
    },
    events: [
      {
        sqs: {
          "arn": "!GetAtt InvoiceQueue.Arn"
        }
      },
      {
        http: {
          method: "GET",
          path: "v1/sendEmails",
          cors: corsSettings,
          authorizer: `cognitoAuthorizer`,
          //@ts-ignore
          // ...GetInvoicesSwaggerSchema,
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
  subscribeToSNS: {
    handler: `src/functions/common/subscribeToSNS/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
      COGNITO_CLIENT_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolClientId}',
    },
    events: [
      {
        sns: {
          "arn": "${self:custom.snsTopicArn}"
        }
      },
      {
        http: {
          method: "POST",
          path: "v1/subscribeToSNS",
          cors: corsSettings,
          // authorizer: `cognitoAuthorizer`,
          // @ts-ignore
          // ...AddInvoiceSwaggerSchema,
        },
      },
    ],
  },
};
