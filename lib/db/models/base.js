const knex = require('../knex')

class Base {
  constructor(tableName, names) {
    this.names = ['id'].concat(names);
    this.tableName = tableName;
    this.createAtKey = 'create_at';
    this.deleteAtKey = 'delete_at';
  }

  async create(data) {
    return knex(this.tableName).insert({
      ...data,
      [this.createAtKey]: knex.fn.now(),
    }, ['id'])
  }

  async delete(where) {
    return knex(this.tableName).where(where).delete();
  }

  async remove(where) {
    return knex(this.tableName).where(where).whereNull(this.deleteAtKey).update({
      [this.deleteAtKey]: knex.fn.now(),
    })
  }

  async update(data, where) {
    return knex(this.tableName).where(where).whereNull(this.deleteAtKey).update(data)
  }

  async findOne(where, select = this.names) {
    return knex.select(select).from(this.tableName).where(where).whereNull(this.deleteAtKey).first();
  }

  async findAll(where, select = this.names) {
    return knex.select(select).from(this.tableName).where(where).whereNull(this.deleteAtKey);
  }
}

module.exports = Base;