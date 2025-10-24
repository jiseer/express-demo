const express = require('express');
const router = express.Router();
const { deleteOneSchema, transactionSchema } = require('../common/validate-schema')
const { transactionModel, categoryModel } = require('../lib/db')
const { validateBodyZod } = require('../middlewares/validate-zod');
const { dayjs } = require('../lib/days');
const Decimal = require('decimal.js');
const { BusinessException } = require('../common/utils/error');

router.post('/create', validateBodyZod(transactionSchema.create), async function (req, res) {
  const data = await transactionModel.create({
    ...req.body,
    date: new Date(req.body.date),
    user_id: req.user.id,
    amount: parseFloat(req.body.amount) * 100,
  });
  res.success(data[0]);
});

router.post('/delete', validateBodyZod(deleteOneSchema), async function (req, res) {
  const { id } = req.body;
  const data = await transactionModel.delete({ id, user_id: req.user.id });
  res.success(!!data);
});


router.get('/details', validateBodyZod(transactionSchema.details), async function (req, res) {
  const { year, month, categoryIds } = req.body;
  const tModel = transactionModel;
  const cModel = categoryModel;
  const date = dayjs([year, month]);
  const between = [
    dayjs(date).startOf('month').toDate(),
    dayjs(date).endOf('month').toDate()
  ];
  const db = tModel.getDb();
  query = db(tModel.tableName).join(cModel.tableName, tModel.c('category_id'), cModel.c('id')).whereBetween(`${tModel.c('date')}`, between).where(`${tModel.c('user_id')}`, req.user.id)
  if (categoryIds?.length) {
    query = query.whereIn(`${tModel.c('category_id')}`, categoryIds);
  }
  const listDetails = await query.select([
    ...tModel.columnsInTable,
    db.raw(`${tModel.formatDate(`${tModel.c('date')}`, '%Y-%m-%d')} AS dateByDay`),
    db.raw(`${cModel.c('type')} as categoryType`)
  ]).orderBy(`${tModel.c('date')}`, 'desc');

  const detailsMap = {};
  const detailsKeys = [];
  const details = [];
  for (const d of listDetails) {
    const dateByDay = d.dateByDay;
    if (detailsMap[dateByDay]) {
      detailsMap[dateByDay].push(d);
    } else {
      detailsKeys.push(dateByDay);
      detailsMap[dateByDay] = [d];
    }
    delete d.dateByDay;
  }
  for (const key of detailsKeys) {
    const items = detailsMap[key];
    let expenditure = new Decimal('0');;
    let income = new Decimal('0');
    let noInclude = new Decimal('0');
    for (const item of items) {
      if (item.categoryType === 1) {
        expenditure = expenditure.add(item.amount);
      } else if (item.categoryType === 2) {
        income = income.add(item.amount);
      } else if (item.categoryType === 3) {
        noInclude = noInclude.add(item.amount);
      }
      delete item.categoryType;
    }
    details.push({
      date: key,
      expenditure: expenditure.toNumber(),
      income: income.toNumber(),
      noInclude: noInclude.toNumber(),
      list: items,
    })
  }
  res.success(details)
});

router.get('/sum', validateBodyZod(transactionSchema.sum), async function (req, res) {
  const { type, year, month, categoryIds } = req.body;
  const tModel = transactionModel;
  const cModel = categoryModel;
  const db = tModel.getDb();
  const date = dayjs([year, month]);
  const between = [
    dayjs(date).startOf('month').toDate(),
    dayjs(date).endOf('month').toDate()
  ];
  let query = db(tModel.tableName).join(cModel.tableName, tModel.c('category_id'), cModel.c('id')).whereBetween(`${tModel.c('date')}`, between).where(`${tModel.c('user_id')}`, req.user.id).select([
    db.raw(`${cModel.c('id')} as id`),
    db.raw(`${cModel.c('name')} as name`),
    db.raw(`${tModel.formatAmount(`SUM(${tModel.c('amount')})`)} AS amount`)
  ])

  if (type) {
    query = query.where(`${cModel.c('type')}`, type);
  }
  if (categoryIds?.length) {
    query = query.whereIn(`${cModel.c('id')}`, categoryIds);
  }
  const list = await query.groupBy('name', 'id').orderBy('amount')
  res.success(list)
})

module.exports = router;