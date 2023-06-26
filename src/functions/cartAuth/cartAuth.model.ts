import { USER_ROLE } from 'src/constants/authConstants';
import { Location } from 'src/constants/locationConstants';

export interface AddUserInput {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
  location: Location;
}

export interface AddUserInputSwagger {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
  location: Location;
}

export const AddUserInputSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 2, maxLength: 100 },
    phone: { type: 'string' },
    address: { type: 'string', minLength: 2, maxLength: 200 },
    role: { type: 'string', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
    location: { type: 'string', enum: ['us-east-1', 'ca-central-1'] },
  },
  required: ['email', 'name', 'role', 'location'],
};


export interface Users {
  users: object;
}

export interface CreateUserSuccess {
  data: User;
}

export interface User {
  user: object;
}

export interface UpdateUserInput {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
  location: Location;
}

export interface UpdateUserInputSwagger {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
  location: Location;
}

export interface UserRef {
  id: string;
  name: string;
  email: string;
}

export interface GetUserInput {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
  location: Location;
}

export interface GetUserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
  location: Location;
}
