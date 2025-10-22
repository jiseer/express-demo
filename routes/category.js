const express = require('express');
const router = express.Router();
const { createCategorySchema, deleteOneSchema } = require('../common/validate-schema')
const { categoryModel } = require('../lib/db')
const { validateBodyZod } = require('../middlewares/validate-zod');
const { BusinessException } = require('../common/utils/error');

router.post('/create', validateBodyZod(createCategorySchema), async function (req, res) {
  const { name } = req.body;
  const category = await categoryModel.findOne({ name });
  if (category) {
    throw new BusinessException('CATEGORY_EXIST')
  }
  const data = await categoryModel.create({ ...req.body, user_id: req.user.id });
  res.success(data[0]);
});

router.post('/delete', validateBodyZod(deleteOneSchema), async function (req, res) {
  const { id } = req.body;
  const data = await categoryModel.delete({ id, user_id: req.user.id });
  res.success(!!data);
});

router.get('/list', async function (req, res) {
  const data = await categoryModel.findAll({ user_id: req.user.id });
  res.success(data);
});

module.exports = router;