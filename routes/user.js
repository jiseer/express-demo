const express = require('express');
const router = express.Router();
const { createUserSchema } = require('../common/validate-schema')
const { userModel } = require('../lib/db')
const loginAuth = require('../middlewares/login-auth')
const bcrypt = require('bcrypt');
const { validateBodyZod } = require('../middlewares/validate-zod');
const { BusinessException } = require('../common/utils/error');
const passport = require('../lib/passport');

router.post('/register', validateBodyZod(createUserSchema), async function (req, res) {
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const existUser = await userModel.findOne({ username });
  if (existUser) {
    throw new BusinessException('USER_EXIST')
  }
  const data = await userModel.create({ username, password: passwordHash });
  res.success(data[0])
});

router.post('/login', validateBodyZod(createUserSchema), passport.authenticate('local'), function (req, res) {
  res.success(true)
});

router.get('/info', loginAuth, async function (req, res) {
  res.success(req.user);
});

module.exports = router;