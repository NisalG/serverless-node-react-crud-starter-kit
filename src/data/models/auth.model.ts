import { USER_ROLE } from 'src/constants/authConstants';

export interface AuthUser {
  id?: string;
}

export interface Claims {
  name: string;
  email: string;
  role: USER_ROLE;
  cognitoUserName?: string;
}

export interface CognitoUserAttribute {
  Name: string;
  Value: string;
}
