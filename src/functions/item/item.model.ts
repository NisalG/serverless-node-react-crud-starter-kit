export interface GetItemOutput {
  id: string;
  name: string;
  description?: string;
  price: number;
}

export interface AddItemInput {
  name: string;
  description?: string;
  price: number;
}

export const AddItemInputSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 100  },
    description: { type: 'string', minLength: 0, maxLength: 200  },
    price: { type: 'number'},
  },
  required: ['name', 'price'],
};

export interface GetItemsSuccess {
  data: Items;
}

export interface Items {
  items: object;
}

export interface GetItemSuccess {
  data: Item;
}

export interface CreateItemSuccess {
  data: Item;
}

export interface DeleteItemSuccess {
  data: Item;
}

export interface Item {
  item: object;
}

export interface UpdateItemInput {
  id: string;
  name: string;
  description?: string;
  price: number;
}

export interface UpdateItemInputForSwagger {
  name: string;
  description?: string;
  price: number;
}

export interface ItemFilterInput {
  filterBy?: string;
  take: number;
  skip: number;
  sortField?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sortOrder?: 'ASC' | 'DESC' | any;
}