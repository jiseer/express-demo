const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = !IS_DEV;

function getEnv(key) {
  return process.env[key];
}

module.exports = {
  IS_DEV,
  IS_PROD,
  getEnv,
}