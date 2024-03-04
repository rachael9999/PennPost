/* eslint-disable no-console */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

let MongoConnection;

const connect = async () => {
  // always use try/catch to handle any exception
  try {
    MongoConnection = (await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
      // eslint-disable-next-line no-console
      console.log('DB connected successfully');
    }));
    return MongoConnection;
  } catch (err) {
    return -1;
  }
};

/**
 *
 * Close the mongodb connection
 */
const closeMongoDBConnection = async () => {
  await MongoConnection.disconnect();
};

module.exports = {
  closeMongoDBConnection,
  connect,
};
