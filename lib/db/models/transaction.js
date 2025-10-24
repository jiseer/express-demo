const { knex } = require('../knex');
const base = require('./base');

const tableName = 'transactions';
class TransactionModel extends base {
  constructor(db) {
    super({
      db,
      tableName,
      columns: [

      ]
    });
    this.columnsInTable.push(
      this.db.raw(`${this.formatAmount(`${this.tableName}.amount`)} AS amount`),
      this.db.raw(`${this.formatDate(`${this.tableName}.date`, '%Y-%m-%d %H:%i:%s')} AS date`),
      this.db.raw(`${this.tableName}.desc AS 'desc'`),
    )
    this.columns.push([
      this.db.raw(`${this.formatAmount('amount')} AS amount`),
      this.db.raw(`${this.formatDate('date', '%Y-%m-%d %H:%i:%s')} AS date`),
      'desc'
    ]);
  }

  formatAmount(name) {
    return `TRIM(TRAILING '.' FROM TRIM(TRAILING '0' FROM TRUNCATE(${name} / 100,2)))`
  }

  formatDate(name, format) {
    return `DATE_FORMAT(${name}, '${format}')`;
  }
}

module.exports = new TransactionModel(knex);