import { AWS } from '@serverless/typescript';

export const authorizerFunctions: AWS['functions'] = {
  cognitoAuthorizer: {
    handler: `src/functions/authorizer/cognito/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
      COGNITO_CLIENT_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolClientId}',
    },
  },
};
