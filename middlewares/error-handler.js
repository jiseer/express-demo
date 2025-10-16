const { HttpError, BusinessException } = require("../common/utils/error");
const { IS_DEV } = require("../common/utils/env");

module.exports = function () {
  return function (error, req, res, next) {
    const message = error.message || 'Server Error';
    let code;
    let obj = {};
    if (error instanceof HttpError) {
      code = error.status;
    } else if (error instanceof BusinessException) {
      code = error.errorCode;
      obj.errorCode = code;
      obj.extraData = error.extraData;
    } else {
      code = 500;
    }
    req.log.error(obj, message);
    res.status(error.status || 500).json({ code: code, message });
  }
}