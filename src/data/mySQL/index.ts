import { AppDataSource, InitDb } from './data-source';
import { Item } from './models/item.schema.model';
import { User } from './models/user.schema.model';

const MySQLDbCon = InitDb;
const SQLDataSource = AppDataSource;

export {
  MySQLDbCon,
  SQLDataSource,
  Item as ItemSchemaModel,
  User as UserSchemaModel,
};
