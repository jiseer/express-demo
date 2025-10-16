const express = require('express');
const router = express.Router();
const resDto = require('../common/utils/resDto');
const { createUserSchema } = require('../common/validate-schema/user')
const userModel = require('../common/db/models/user')
const errorEnums = require('../common/error-enums')
const loginAuth = require('../middlewares/login-auth')
const bcrypt = require('bcrypt');
const { validateBodyZod, validateQueryZod } = require('../middlewares/validate-zod');
const { BusinessException } = require('../common/utils/error');
const passport = require('passport');

router.post('/register', validateBodyZod(createUserSchema), async function (req, res) {
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 12);
  const existUser = await userModel.getOne({ username });
  if (existUser) {
    throw new BusinessException(errorEnums.USER_EXIST)
  }
  await userModel.create({ username, password: passwordHash });
  res.redirect('/login')
});

router.post('/login', validateBodyZod(createUserSchema), passport.authenticate('local', {
  successRedirect: '/'
}));

router.get('/info', loginAuth, async function (req, res) {
  res.json(resDto.success(req.user));
});

module.exports = router;