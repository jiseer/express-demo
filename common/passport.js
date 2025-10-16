const userModel = require('./db/models/user')
const errorEnums = require('./error-enums')
const bcrypt = require('bcrypt');
const { BusinessException } = require('./utils/error');
const LocalStrategy = require('passport-local');

const localStrategy = new LocalStrategy(
  { passReqToCallback: true },
  async (req, _u, _p, done) => {
    const { username, password } = req.body;
    const existUser = await userModel.getOne({ username }, ['id', 'password']);
    if (existUser) {
      await bcrypt.compare(password, existUser.password);
      done(null, existUser)
    } else {
      throw new BusinessException(errorEnums.INVALID_USERNAME_PASSWORD)
    }
  })

const deserializeUser = async function (id, done) {
  const user = await userModel.getOne({ id });
  done(null, user);
};

const serializeUser = function (user, done) {
  done(null, user.id);
}

module.exports = {
  localStrategy,
  deserializeUser,
  serializeUser,
}