import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { CognitoContext } from './authorizer.model';
import { Logger } from '@common/logger';
import { Context } from 'aws-lambda';

export const generatePolicyDocumentCognito = async (principalId: string, effect: string, methodArn: string, contextFromToken: CognitoIdTokenPayload) => {
  if (!effect || !methodArn) return null;

  const context: CognitoContext = {
    email: contextFromToken['email']?.toString(),
    'custom:location': contextFromToken['custom:location']?.toString(),
    'custom:role': contextFromToken['custom:role']?.toString(),
  };
  
  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: '*', //Changed due to caching issues: https://www.alexdebrie.com/posts/lambda-custom-authorizers/
      },
    ],
  };

  return {
    principalId,
    policyDocument,
    context,
  };
};

export const getValidatedCognitoPayload = async (logger: Logger, context: Context, decoded: CognitoIdTokenPayload, methodArn: string) => {
  if (!decoded) {
    logger.Warning({ message: 'Provided token is not valid' });
    return context.fail('Unauthorized');
  }

  if (Date.now() >= decoded.exp * 1000) {
    logger.Warning({ message: 'Provided token is expired' });
    return context.fail('Unauthorized');
  }

  if (decoded['cognito:username']) {
    logger.Info({ message: 'Cognito Authorizer - Valid token, returning success policy' });

    const policySucceed = await generatePolicyDocumentCognito(decoded.sub, 'Allow', methodArn, decoded);
    return context.succeed(policySucceed);
  } else {
    logger.Warning({ message: 'No decoded username attached' });
    return context.fail('Unauthorized');
  }
};
