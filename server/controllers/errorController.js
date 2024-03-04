const AppError = require('../utils/appError');

const DuplicateKeyHandler = (err) => {
  const value = err.keyValue.email;
  return new AppError(`duplciate key ${value}`, 400);
};

const ValidatorErrorHandler = (err) => {
  const message = `invalid type for ${err.errors.path} with value ${err.errors.value}`;
  return new AppError(message, 400);
};

const sendErr = (err, req, res, next) => {
  const errCopy = { ...err };
  errCopy.status = err.status || 'error';
  errCopy.statusCode = err.statusCode || 500;

  let error;

  if (err.name === 'ValidationError') {
    error = ValidatorErrorHandler(err);
  } else if (err.code === 11000) {
    error = DuplicateKeyHandler(err);
  } else {
    error = { ...errCopy };
  }

  res.status(error.statusCode).json({
    err: error,
    status: error.status,
    message: error.message,
  });

  next();
};

module.exports = sendErr;
