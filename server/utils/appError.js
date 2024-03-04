class appError extends Error {
  constructor(message, code) {
    super(message);

    this.statusCode = code;
    this.status = `${code}`.startsWith('4') ? 'bad request' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = appError;
