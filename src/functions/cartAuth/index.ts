import { AWS } from '@serverless/typescript';
import { corsSettings } from '@functions/function.config';
import { GetCognitoRefreshTokenSwaggerSchema, RefreshCognitoSessionSwaggerSchema, ResetPasswordCognitoSwaggerSchema } from '@functions/cartAuth/cartAuth.swagger';

export const cartAuthFunctions: AWS['functions'] = {
  authenticateCognitoUser: {
    handler: `src/functions/cartAuth/authenticateUser/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
      COGNITO_CLIENT_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolClientId}',
    },
    events: [
      {
        http: {
          method: 'POST',
          path: 'v1/cartAuth/authenticateUser',
          cors: corsSettings,
          // authorizer: `cognitoAuthorizer`,
          ...GetCognitoRefreshTokenSwaggerSchema,
        },
      },
    ],
    // @ts-ignore
    // warmup: {
    //   default: {
    //     enabled: ['dev', 'stg'],
    //   },
    // },
  },
  refreshCognitoSession: {
    handler: `src/functions/cartAuth/refreshSession/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
      COGNITO_CLIENT_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolClientId}',
    },
    events: [
      {
        http: {
          method: 'POST',
          path: 'v1/cartAuth/refreshUserSession',
          cors: corsSettings,
          ...RefreshCognitoSessionSwaggerSchema,
        },
      },
    ],
    // @ts-ignore
    // warmup: {
    //   default: {
    //     enabled: ['dev', 'stg'],
    //   },
    // },
  },
  resetPasswordCognito: {
    handler: `src/functions/cartAuth/resetPassword/handler.main`,
    environment: {
      COGNITO_USER_POOL_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolId}',
      COGNITO_CLIENT_ID: '${cf(us-east-1):cart-cognito-${sls:stage}.UserPoolClientId}',
    },
    events: [
      {
        http: {
          method: 'POST',
          path: 'v1/cartAuth/resetPassword',
          cors: corsSettings,
          ...ResetPasswordCognitoSwaggerSchema,
        },
      },
    ],
  },
};
