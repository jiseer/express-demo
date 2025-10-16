const knex = require('..')

const names = [
  'id',
  'username',
]
class UserModel {
  constructor() {
    this.tableName = 'users';
  }

  async create(data) {
    return knex(this.tableName).insert(data, ['id'])
  }

  async getOne(where, select = names) {
    return knex.select(select).from(this.tableName).where(where).first();
  }
}

module.exports = new UserModel();