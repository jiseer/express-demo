const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars');
const session = require('express-session')
const rateLimit = require('express-rate-limit')
const pinoHttp = require('pino-http');
const connectRedis = require('connect-redis')
const rateLimitRedis = require('rate-limit-redis')

require('dotenv-flow').config();

const notFound = require('./middlewares/not-found');
const { getEnv } = require('./common/utils/env');
const { createError } = require('./common/utils/error');
const errorHandler = require('./middlewares/error-handler');
const logger = require('./lib/logger/pino');
const init = require('./middlewares/init');
const redisClient = require('./lib/redis')
const passport = require('./lib/passport')
const appName = getEnv('APP_NAME');

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
    const error = createError(429);
    console.log(`${req.ip} - ${req.header('user-agent')} - ${error.message}`);
    next(error);
  },
  store: new rateLimitRedis.RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
}))
app.use(init());
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
  name: appName + 'sid',
  secret: getEnv('SECRET'),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60, httpOnly: true, },
  store: new connectRedis.RedisStore({ client: redisClient, prefix: appName + ':' })
}));
app.use(passport.initialize())
app.use(passport.session())

app.use('/static', express.static('public'))
require('./routes')(app);
app.use(notFound());
app.use(errorHandler())

app.listen(getEnv('PORT'), () => {
  console.log('Server is running on http://localhost:3000')
})
