module.exports = function () {
  return function (req, res, next) {
    res.success = function (data, code = 200) {
      res.json({
        data,
        code,
        message: 'ok'
      });
    }
    next()
  }
}