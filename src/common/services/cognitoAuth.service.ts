import { User } from '@data/mySQL/models/user.schema.model';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { CognitoUserAttribute } from '@data/models/auth.model';
import { Logger } from '@common/logger';
import { COGNITO_CLAIM, USER_ROLE } from 'src/constants/authConstants';

export const addCognitoUser = async (
  user: User,
  userAttributes: CognitoUserAttribute[],
  cognitoIdentityServiceProvider: CognitoIdentityServiceProvider,
  userCreatedNotification = true,
) => {
  console.log('user.email in addCognitoUser', user.email);
  
  const params: CognitoIdentityServiceProvider.Types.AdminCreateUserRequest = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: user.email,
    UserAttributes: userAttributes,
  };

  if (userCreatedNotification) params.DesiredDeliveryMediums = ['EMAIL'];

  const result = await cognitoIdentityServiceProvider.adminCreateUser(params).promise();
  console.log('result of addCognitoUser', result);
  return result.User;
};

export const deleteUserFromCognitoPool = async (logger: Logger, userEmail: string, cognitoIdentityServiceProvider: CognitoIdentityServiceProvider) => {
  logger.Info({ message: `Disabling User ${userEmail} from cognito` });
  const params: CognitoIdentityServiceProvider.Types.AdminDeleteUserRequest = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: userEmail,
  };

  const result = await cognitoIdentityServiceProvider.adminDisableUser(params).promise();
  return result.$response.data;
};

export const getCognitoUser = async (cognitoUsername: string, cognitoIdentityServiceProvider: CognitoIdentityServiceProvider) => {
  const params: CognitoIdentityServiceProvider.Types.AdminGetUserRequest = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: cognitoUsername, // both email and username accepted here
  };

  const result = await cognitoIdentityServiceProvider.adminGetUser(params).promise();
  return result.$response.data as CognitoIdentityServiceProvider.Types.AdminGetUserResponse;
};

export const updateAttributesOfCognitoUser = async (user: User, userAttributes: CognitoUserAttribute[], cognitoIdentityServiceProvider: CognitoIdentityServiceProvider) => {
  const cognitoUser: CognitoIdentityServiceProvider.Types.AdminGetUserResponse = await getCognitoUser(user.email, cognitoIdentityServiceProvider);

  //merge attributes with new values
  const nonMutableAttributes = ['sub', 'email']; //these attributes are not allowed to update in Cognito
  const attributes = new Set(userAttributes.map((attribute: CognitoUserAttribute) => attribute.Name));
  const newAttributes = [...userAttributes, ...cognitoUser.UserAttributes.filter((attribute) => !nonMutableAttributes.includes(attribute.Name) && !attributes.has(attribute.Name))];

  const params: CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesRequest = {
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: user.email,
    UserAttributes: newAttributes,
  };

  const result = await cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();
  return result.$response.data;
};

export const setUserPassword = async (
  logger: Logger,
  adminSetUserPasswordRequest: CognitoIdentityServiceProvider.AdminSetUserPasswordRequest,
  cognitoIdentityServiceProvider: CognitoIdentityServiceProvider,
) => {
  logger.Info({ message: `Setting Cognito user password of cognito user ${adminSetUserPasswordRequest.Username}` });

  const data = new Promise<CognitoIdentityServiceProvider.AdminSetUserPasswordResponse>((resolve, reject) =>
    cognitoIdentityServiceProvider.adminSetUserPassword(adminSetUserPasswordRequest, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    }),
  );

  return await data;
};

export const getAdminClaim = () => {
  const claims = [];
  claims[COGNITO_CLAIM.NAME] = 'Admin';
  claims[COGNITO_CLAIM.EMAIL] = 'admin@cart-domain.com';
  claims[COGNITO_CLAIM.ROLE] = USER_ROLE.ADMIN;

  return claims;
};