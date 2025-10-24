const { knex } = require('../knex');
const Base = require('./base');

class UserModel extends Base {
  constructor(db) {
    super({
      db,
      tableName: 'users',
      columns: ['username'],
    });
  }
}

module.exports = new UserModel(knex);