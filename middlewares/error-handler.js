const { HttpError, BusinessException } = require("../common/utils/error");

/**
  code?: string;      // PostgreSQL / MySQL
  errno?: number;     // MySQL
  sqlState?: string;  // MySQL
  constraint?: string;// PostgreSQL
 */
function isSqlError(err) {
  return (
    err &&
    typeof err === 'object' &&
    (typeof err.code === 'string' || typeof err.errno === 'number')
  );
}
const defaultMessage = 'Server Error';

module.exports = function () {
  return function (error, req, res, next) {
    let message = error.message || defaultMessage;
    let status = error.status || 500;
    let code = status;
    let objMsg = {}, data = null;
    if (error instanceof BusinessException) {
      code = error.errorCode;
      objMsg.errorCode = code;
      objMsg.extraData = error.extraData;
      data = error.data;
    } else if (isSqlError(error)) {
      message = defaultMessage;
    }
    if (req.log) {
      req.log.error(objMsg, error.message);
    }
    res.status(status).json({ code: code, message, data });
  }
}