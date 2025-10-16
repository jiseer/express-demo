const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars');
const passport = require('passport')
const session = require('express-session')
const rateLimit = require('express-rate-limit')
const pinoHttp = require('pino-http');

require('./config')

const notFound = require('./middlewares/not-found');
const { getEnv } = require('./common/utils/env');
const { BusinessException } = require('./common/utils/error');
const errorEnums = require('./common/error-enums');
const errorHandler = require('./middlewares/error-handler');
const logger = require('./common/logger/pino');
const { localStrategy, deserializeUser, serializeUser } = require('./common/passport')

const app = express();

app.engine('hbs', engine({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'))

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new BusinessException(errorEnums.TOO_MANY_REQUESTS));
  }
}))
app.use(pinoHttp({
  logger,
  autoLogging: {
    ignore: (req) => {
      return req.url.startsWith('/static');
    },
  },
  serializers: {
    req(req) {
      return {
        // id: req.id,
        method: req.method,
        url: req.url,
        ua: req.headers['user-agent'],
      };
    },
    res(res) {
      return {
        statusCode: res.statusCode,
      };
    },
  }
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: getEnv('SECRET'),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60, httpOnly: true, },
}));
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);
passport.use(localStrategy)

app.use('/static', express.static('public'))
require('./routes')(app);
app.use(notFound());
app.use(errorHandler())

app.listen(getEnv('PORT'), () => {
  console.log('Server is running on http://localhost:3000')
})
