const { BusinessException } = require('../common/utils/error');
const userRouter = require('./user')
const categoryRouter = require('./category')
const loginAuth = require('../middlewares/login-auth')

module.exports = function (app) {
  // 页面
  app.get('/', function (req, res) {
    res.render('index')
  });
  app.get('/register', function (req, res) {
    res.render('register')
  });
  app.get('/login', function (req, res) {
    res.render('login')
  });

  // api接口
  app.use('/api/user', userRouter)
  app.use('/api/category', loginAuth, categoryRouter)
  app.use('/api', function (req, res, next) {
    next(new BusinessException('API_REQUEST_404'))
  })
}