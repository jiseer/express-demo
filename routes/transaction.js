const express = require('express');
const router = express.Router();
const { createTransactionSchema, deleteOneSchema, listTransactionSchema } = require('../common/validate-schema')
const { transactionModel } = require('../lib/db')
const { validateBodyZod } = require('../middlewares/validate-zod');
const _ = require('lodash')
const dayjs = require('dayjs');

router.post('/create', validateBodyZod(createTransactionSchema), async function (req, res) {
  const data = await transactionModel.create({ ...req.body, user_id: req.user.id });
  res.success(data[0]);
});

router.post('/delete', validateBodyZod(deleteOneSchema), async function (req, res) {
  const { id } = req.body;
  const data = await transactionModel.delete({ id, user_id: req.user.id });
  res.success(!!data);
});

router.get('/list', validateBodyZod(listTransactionSchema), async function (req, res) {
  let query = transactionModel.findAll({ user_id: req.user.id },);
  if (!req.body || _.isEmpty(req.body)) {
    data = await query;
  } else {
    const { order, date } = req.body;
    if (date) {
      // 按月计算
      query = query.whereBetween('date', [dayjs(date).startOf('month').toDate(), dayjs(date).endOf('month').toDate()]);
    }
    if (order) {
      query = query.orderBy('amount', req.body.order);
    }
    data = await query;
  }
  res.success(data);
});

module.exports = router;