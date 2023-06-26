export interface AuthenticateCognitoUserInput {
  username: string;
  password: string;
}

export interface RefreshCognitoSessionInput {
  username: string;
  refreshToken: string;
}

export interface CognitoSessionTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export interface CognitoSessionTokensResponse {
  tokens: CognitoSessionTokens;
}

export interface ResetPasswordInput {
  username: string;
  existingPassword: string;
  newPassword: string;
}
