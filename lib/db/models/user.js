const { knex } = require('../knex');
const Base = require('./base');

const tableName = 'users';
class UserModel extends Base {
  constructor(db) {
    super({
      db,
      tableName,
      columns: [
        'username'
      ],
    });
  }
}

module.exports = new UserModel(knex);