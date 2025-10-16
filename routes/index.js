const errorEnums = require('../common/error-enums');
const { BusinessException } = require('../common/utils/error');
const userRouter = require('./user')

module.exports = function (app) {
  // 页面
  app.get('/register', function (req, res) {
    res.render('register')
  });
  app.get('/login', function (req, res) {
    res.render('login')
  });

  // api接口
  app.use('/api/user', userRouter)
  app.use('/api', function (req, res, next) {
    next(new BusinessException(errorEnums.API_REQUEST_404))
  })
}