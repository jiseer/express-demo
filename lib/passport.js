const passport = require('passport')
const { userModel } = require('./db')
const bcrypt = require('bcrypt');
const { BusinessException } = require('../common/utils/error');
const LocalStrategy = require('passport-local');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await userModel.findOne({ id });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (e) {
    done(e);
  }
});

passport.use(new LocalStrategy(
  { passReqToCallback: true },
  async (req, _u, _p, done) => {
    try {
      const { username, password } = req.body;
      const existUser = await userModel.findOne({ username }, ['id', 'password']);
      if (existUser) {
        await bcrypt.compare(password, existUser.password);
        done(null, existUser)
      } else {
        throw new BusinessException('INVALID_USERNAME_PASSWORD')
      }
    } catch (e) {
      done(e);
    }
  }))
  
module.exports = passport;