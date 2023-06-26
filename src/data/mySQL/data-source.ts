import { Logger } from '@common/logger';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { MYSQL_SERVICE } from '../../../src/constants/commonConstants';
import { Item } from './models/item.schema.model';
import { User } from './models/user.schema.model';

export const AppDataSource = new DataSource({
  type: 'mysql',
  //------------------- uncomment when general application process -------------------
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DBNAME,

  //------------------- uncomment when running migrations & seeding-------------------
  // host: 'serverless-crud-1-db.c3ax2djmenfv.us-east-1.rds.amazonaws.com',
  // username: 'admin',
  // password: '8bu2LCPzmM9cDTA',
  // database: 'serverless-crud-1',

  port: 3306,
  synchronize: false,
  logging: true,
  entities: [
    Item,
    User
  ],
  migrations: ['src/data/mySQL/migration/**/*.ts'],
  subscribers: ['src/data/mySQL/subscriber/**/*.ts'],
});

let dataSource: DataSource;

export const InitDb = async () => {
  const logger = new Logger(MYSQL_SERVICE);
  if (!dataSource) {
    logger.Info({ message: 'Getting a new MySQL connection' });
    dataSource = await AppDataSource.initialize();
  }
  return;
};
