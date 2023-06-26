import { Logger } from '@common/logger';
import mongoose, { connect } from 'mongoose';
import { MONGODB_SERVICE } from 'src/constants/commonConstants';

let conn = null;
const logger = new Logger(MONGODB_SERVICE);

const connectToDatabase = async (uri: string) => {
  if (conn === null) {
    logger.Info({ message: 'Connecting to the mongo db database...' });
    conn = connect(uri, {
      serverSelectionTimeoutMS: 5000,
    })
      .then(() => mongoose)
      .catch((err) => logger.Error(err));

    await conn;
  }

  return conn;
};

export const dbConnection = connectToDatabase;
