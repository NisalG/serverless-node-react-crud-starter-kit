import { Logger } from '@common/logger';
import { API_AUTH_SERVICE } from 'src/constants/commonConstants';
import { getValidatedCognitoPayload } from '../authorizer.service';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

const cognitoAuthorizer = async (event, context) => {
  const logger = new Logger(API_AUTH_SERVICE, context.awsRequestId);

  try {
    logger.Info({ message: 'Cognito Authorizer - Validating if JWT is valid' });

    const token = event.authorizationToken.replace('Bearer ', '');
    const methodArn = event.methodArn;

    if (!token || !methodArn) {
      logger.Warning({ message: `Either token ${token} or methodArn ${methodArn} is missing` });
      return context.fail('Unauthorized');
    }

    logger.Info({ message: 'Cognito Authorizer - Validating the JWT' });
    const verifier = CognitoJwtVerifier.create({
      userPoolId,
      tokenUse: 'id',
      clientId,
    });

    const decoded: CognitoIdTokenPayload = await verifier.verify(token);

    return getValidatedCognitoPayload(logger, context, decoded, methodArn);
  } catch (err) {
    logger.Error(err);
    return context.fail('Unauthorized');
  }
};

export const main = cognitoAuthorizer;
