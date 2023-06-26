import { USER_ROLE } from 'src/constants/authConstants';
import { Location } from 'src/constants/locationConstants';

export interface AddCartUserInput {
  email: string;
  name: string;
  password: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
  location: Location;
}

export interface AddCartUserInputSwagger {
  email: string;
  name: string;
  password: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
  location: Location;
}

export const AddCartUserInputSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    name: { type: 'string', minLength: 2, maxLength: 100 },
    password: { type: 'string', minLength: 6, maxLength: 10 },
    phone: { type: 'string' },
    address: { type: 'string', minLength: 2, maxLength: 200 },
    role: { type: 'string', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] },
    location: { type: 'string', enum: ['us-east-1', 'ca-central-1'] },
  },
  required: ['email', 'firstName', 'lastName', 'password', 'role', 'location'],
};

export interface GetCartUsersSuccess {
  data: CartUsers;
}

export interface CartUsers {
  cartUsers: object;
}

export interface GetCartUserSuccess {
  data: CartUser;
}

export interface CreateCartUserSuccess {
  data: CartUser;
}

export interface CartUser {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
  location: Location;
}

export interface UpdateCartUserInput {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
  location: Location;
}

export interface UpdateCartUserInputSwagger {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
  location: Location;
}

export interface GetCartUserInput {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: string;
  location: Location;
}

export interface GetCartUserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface CartUserFilterInput {
  filterBy?: string;
  take: number;
  skip: number;
  sortField?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortOrder?: 'ASC' | 'DESC' | any;
}