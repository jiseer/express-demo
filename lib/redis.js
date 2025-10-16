const { createClient } = require('redis');
const { getEnv } = require('../common/utils/env');

const client = createClient({
  url: getEnv('REDIS_URL'),
})
  .on("error", (err) => console.log("Redis Client Error", err))
  .on('connect', () => console.log("Redis Client Connect"))
  .on('ready', () => console.log("Redis Client Ready"))
  .on('reconnecting', () => console.log("Redis Client Reconnecting"))
  .on('end', () => console.log("Redis Client End"))
client.connect()

module.exports = client;