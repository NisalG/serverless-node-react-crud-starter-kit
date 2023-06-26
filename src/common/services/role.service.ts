/* eslint-disable @typescript-eslint/no-explicit-any */
import { COGNITO_CLAIM, USER_ROLE } from 'src/constants/authConstants';
import { UnAuthorizedError } from '@common/ErrorTypes';
import { Logger } from '@common/logger';
import { Claims } from '@data/models/auth.model';

export const isAdmin = (claims: any) => {
  console.log(claims[COGNITO_CLAIM.ROLE]);
  console.log(USER_ROLE.ADMIN);
  return claims[COGNITO_CLAIM.ROLE] === USER_ROLE.ADMIN;
};

export const isUser = (claims: any) => {
  return claims[COGNITO_CLAIM.ROLE] === USER_ROLE.USER;
};

export const getClaimsPrepared = (claims: any) => {
  return {
    name: claims[COGNITO_CLAIM.NAME],
    email: claims[COGNITO_CLAIM.EMAIL],
    role: claims[COGNITO_CLAIM.ROLE],
    cognitoUserName: claims[COGNITO_CLAIM.USERNAME],
  } as Claims;
};

export const isUserAuthorized = (logger: Logger, claims: any) => {
  if (!isAdmin(claims)) {
    const err = new UnAuthorizedError(`User is not an ADMIN role to perform this task`);
    logger.Error(err);
    throw err;
  }
};
