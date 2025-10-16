const { BusinessException } = require("../common/utils/error");

module.exports = function (req, res, next) {
  next(req.isAuthenticated() ? null : new BusinessException('TO_LOGIN'))
}