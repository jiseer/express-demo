const { knex } = require('../knex');
const base = require('./base');

/**
 * type: 1:支出 2:入账 3:不计入收支
 */

class CategoryModel extends base {
  constructor(db) {
    super({
      db,
      tableName: 'categories',
      columns: ['name', 'type']
    });
  }
}

module.exports = new CategoryModel(knex);