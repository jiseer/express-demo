const createError = require('http-errors');

class BusinessException extends Error {
  constructor(message, extraData) {
    const [errorCode, errorMessage] = message.split(':')
    super(errorMessage);
    this.status = 200;
    this.errorCode = errorCode;
    this.extraData = extraData;
  }
}

module.exports = {
  createError,
  HttpError: createError.HttpError,
  BusinessException,
}