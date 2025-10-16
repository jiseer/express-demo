const { HttpError, BusinessException } = require("../common/utils/error");

module.exports = function () {
  return function (error, req, res, next) {
    const message = error.message || 'Server Error';
    let code;
    let objMsg = {}, data = null;
    if (error instanceof HttpError) {
      code = error.status;
    } else if (error instanceof BusinessException) {
      code = error.errorCode;
      objMsg.errorCode = code;
      objMsg.extraData = error.extraData;
      data = error.data;
    } else {
      code = 500;
    }
    if (req.log) {
      req.log.error(objMsg, message);
    }
    res.status(error.status || 500).json({ code: code, message, data });
  }
}