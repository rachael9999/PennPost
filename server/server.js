/* eslint-disable no-console */
const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const { connect } = require('./dbFunctions');

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  // eslint-disable-next-line no-console
  console.log(err.name, err.message);
  process.exit(1);
});

connect().then(() => {
  const server = app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running at port: ${process.env.PORT}/`);
  });

  process.on('unhandledRejection', (err) => {
    // eslint-disable-next-line no-console
    console.log('UNHANDLED REJECTION!  Shutting down...');
    // eslint-disable-next-line no-console
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
});
