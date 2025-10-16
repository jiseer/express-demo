const knex = require('../knex');
const base = require('./base');

class CategoryModel extends base {
  constructor() {
    super('categories', ['name']);
  }
}

module.exports = new CategoryModel();