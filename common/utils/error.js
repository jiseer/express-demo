const createError = require('http-errors');
const errorEnums = require('../error-enums');

class BusinessException extends Error {
  constructor(errorKey, data, extraData) {
    const [errorCode, errorMessage] = errorEnums[errorKey].split(':');
    super(errorMessage);
    this.status = 200;
    this.errorCode = Number(errorCode);
    this.extraData = extraData;
    this.data = data;
  }
}

module.exports = {
  createError,
  HttpError: createError.HttpError,
  BusinessException,
}