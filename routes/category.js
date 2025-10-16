const express = require('express');
const router = express.Router();
const { createCategorySchema, deleteCategorySchema } = require('../common/validate-schema/category')
const { categoryModel } = require('../lib/db')
const { validateBodyZod, validateQueryZod } = require('../middlewares/validate-zod');
const { BusinessException } = require('../common/utils/error');

router.post('/create', validateBodyZod(createCategorySchema), async function (req, res) {
  const { name } = req.body;
  const category = await categoryModel.findOne({ name });
  if (category) {
    throw new BusinessException('CATEGORY_EXIST')
  }
  const data = await categoryModel.create({ name, user_id: req.user.id });
  res.success(data[0]);
});

router.post('/delete', validateBodyZod(deleteCategorySchema), async function (req, res) {
  const { id } = req.body;
  const data = await categoryModel.remove({ id, user_id: req.user.id });
  res.success(!!data);
});

router.get('/list', async function (req, res) {
  const data = await categoryModel.findAll({ user_id: req.user.id });
  res.success(data);
});

module.exports = router;