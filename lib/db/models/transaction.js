const { knex } = require('../knex');
const base = require('./base');
const categoryModel = require('./category');

class TransactionModel extends base {
  constructor(db) {
    super({
      db,
      tableName: 'transactions',
    });
    this.defaultColumns.push(
      this.getAmountColumnAs(),
      this.getDateColumnAs(),
      'desc'
    )
    this.columns.push(...this.defaultColumns);
  }

  getAmountColumnAs(name = 'amount') {
    return this.db.raw(`TRIM(TRAILING '.' FROM TRIM(TRAILING '0' FROM TRUNCATE(${name} / 100,2))) AS amount`);
  }

  getDateColumnAs(format = '%Y-%m-%d %H:%i:%s', as = 'date') {
    return this.db.raw(`DATE_FORMAT(date, '${format}') AS ${as}`);
  }
}

module.exports = new TransactionModel(knex);