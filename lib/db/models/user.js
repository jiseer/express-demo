const {knex} = require('../knex');
const Base = require('./base');

class UserModel extends Base {
  constructor() {
    super('users', ['username']);
  }
}

module.exports = new UserModel();