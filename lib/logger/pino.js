const pino = require('pino')
const { IS_DEV } = require('../../common/utils/env')
const fs = require('fs')

if (IS_DEV) {
  fs.rmSync('logs', { force: true, recursive: true })
}

const targets = [
  {
    target: 'pino-roll',
    level: 'info',
    options: {
      file: 'logs/app.log',
      frequency: 'daily',
      mkdir: true,
      extension: '.log',
      maxFiles: 30,
      compress: true,
      interval: '7d',
    }
  },
  {
    target: 'pino-roll',
    level: 'error',
    options: {
      file: 'logs/error.log',
      frequency: 'daily',
      mkdir: true,
      extension: '.log',
      maxFiles: 30,
      compress: true,
      interval: '7d',
    }
  }
]

if (IS_DEV) {
  targets.push({ target: 'pino-pretty', level: 'debug', options: { colorize: true } })
}
const logger = pino({
  level: 'debug',
  transport: {
    targets,
  }
});

module.exports = logger;