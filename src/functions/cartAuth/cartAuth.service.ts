import { Logger } from '@common/logger';
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  IAuthenticationDetailsData,
  ICognitoUserData,
  ICognitoUserPoolData,
} from 'amazon-cognito-identity-js';
import { apiResponse } from '@common/apiResponse';
import { AuthenticateCognitoUserInput, CognitoSessionTokens, RefreshCognitoSessionInput, ResetPasswordInput } from '../../types/authTypes';
import * as AWS from 'aws-sdk';
import { BadRequestError, CustomUIError, UnAuthorizedError } from '@common/ErrorTypes';
import { isAdmin } from '@common/services/role.service';
import { COGNITO_CLAIM } from 'src/constants/authConstants';

const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

export const authenticateCognitoUser = async (logger: Logger, authInput: AuthenticateCognitoUserInput) => {
  logger.Info({ message: `Authenticating cognito user ${authInput.username}` });

  const cognitoUser: CognitoUser = getCognitoUserData(logger, authInput.username);

  const authDetails: IAuthenticationDetailsData = {
    Username: authInput.username,
    Password: authInput.password,
  };

  const authInfo = new AuthenticationDetails(authDetails);

  console.log('authInfo', authInfo);
  

  const authenticateUser = new Promise<CognitoUserSession>((resolve, reject) =>
    cognitoUser.authenticateUser(authInfo, {
      onSuccess: function (session) {
        resolve(session);
      },
      onFailure: function (err) {
        reject(err);
      },
    }),
  );
  console.log('authenticateUser', authenticateUser);

  const session = await authenticateUser;
  const tokens: CognitoSessionTokens = getTokensFromSession(logger, session);
  console.log('tokens', tokens);
  return apiResponse._200({ tokens });
};

export const authenticateCognitoUserCode = async (logger: Logger, authInput: AuthenticateCognitoUserInput) => {
  logger.Info({ message: `Authenticating cognito user ${authInput.username}` });

  const cognitoUser: CognitoUser = getCognitoUserData(logger, authInput.username);

  const authDetails: IAuthenticationDetailsData = {
    Username: authInput.username,
    Password: authInput.password,
  };

  const authInfo = new AuthenticationDetails(authDetails);

  const authenticateUser = new Promise<CognitoUserSession>((resolve, reject) =>
    cognitoUser.authenticateUser(authInfo, {
      onSuccess: function (session) {
        resolve(session);
      },
      onFailure: function (err) {
        reject(err);
      },
    }),
  );

  await authenticateUser;
  return cognitoUser;
};

export const refreshCognitoUserSession = async (logger: Logger, authInput: RefreshCognitoSessionInput) => {
  logger.Info({ message: `Refreshing Cognito user session of cognito user ${authInput.username}` });

  const cognitoUser: CognitoUser = getCognitoUserData(logger, authInput.username);

  const cognitoRefreshToken = new CognitoRefreshToken({ RefreshToken: authInput.refreshToken });

  const refreshSession = new Promise<CognitoUserSession>((resolve, reject) =>
    cognitoUser.refreshSession(cognitoRefreshToken, (err, session) => {
      if (err) {
        reject(err);
      }

      resolve(session);
    }),
  );

  const session = await refreshSession;
  const tokens: CognitoSessionTokens = getTokensFromSession(logger, session);

  return apiResponse._200({ tokens });
};

export const getCognitoUserData = (logger: Logger, username: string) => {
  logger.Info({ message: 'Getting Cognito user object.' });

  //setting this manually since we have set this Cognito up only in us-eat-1 region
  AWS.config.region = 'us-east-1';

  const cognitoUserPool: CognitoUserPool = getCognitoUserPool(logger);
  const cognitoUserData: ICognitoUserData = {
    Pool: cognitoUserPool,
    Username: username,
  };

  return new CognitoUser(cognitoUserData);
};

export const getCognitoUserPool = (logger: Logger) => {
  logger.Info({ message: 'Getting Cognito user pool.' });

  const cognitoUserPoolData: ICognitoUserPoolData = {
    UserPoolId: userPoolId,
    ClientId: clientId,
  };

  return new CognitoUserPool(cognitoUserPoolData);
};

export const getTokensFromSession = (logger: Logger, session: CognitoUserSession) => {
  logger.Info({ message: 'Getting tokens from the session.' });

  const tokens: CognitoSessionTokens = {
    idToken: session.getIdToken().getJwtToken(),
    accessToken: session.getAccessToken().getJwtToken(),
    refreshToken: session.getRefreshToken().getToken(),
  };

  return tokens;
};

export const resetPassword = async (logger: Logger, authInput: ResetPasswordInput) => {
  logger.Info({ message: `Resetting password for user ${authInput.username}` });
  const auth: AuthenticateCognitoUserInput = {
    password: authInput.existingPassword,
    username: authInput.username,
  };

  try {
    const cognitoUser = await authenticateCognitoUserCode(logger, auth);

    const resetPasswordPromise = new Promise<string>((resolve, reject) =>
      cognitoUser.changePassword(authInput.existingPassword, authInput.newPassword, (err, result) => {
        if (err) {
          logger.Error(err);
          reject(err);
        }

        logger.Info({ message: `Password reset sucess for user ${authInput.username}` });
        resolve(result);
      }),
    );

    const resetResult = await resetPasswordPromise;
    return apiResponse._200({ resetResult });
  } catch (err) {
    logger.Error(err);
    if (err.message === 'Incorrect username or password.') {
      throw new CustomUIError(err.message);
    }
    throw err;
  }
};
