class Base {
  constructor({ db, tableName, columns = [], rawColumns = [] }) {
    this.db = db;
    this.tableName = tableName;
    this.columns = ['id'].concat(columns);
    this.columnsInTable = [db.raw(`${this.tableName}.id AS id`)].concat(rawColumns);
    this.createAtKey = 'create_at';
    this.deleteAtKey = 'delete_at';
  }

  getDb() {
    return this.db;
  }
  
  c(name) {
    return `${this.tableName}.${name}`
  }

  create(data) {
    return this.db(this.tableName).insert({
      ...data,
      [this.createAtKey]: knex.fn.now(),
    }, ['id'])
  }

  delete(where) {
    return this.db(this.tableName).where(where).delete();
  }

  remove(where) {
    return this.db(this.tableName).where(where).whereNull(this.deleteAtKey).update({
      [this.deleteAtKey]: knex.fn.now(),
    })
  }

  update(data, where) {
    return this.db(this.tableName).where(where).whereNull(this.deleteAtKey).update(data)
  }

  findOne(where, select = this.columns) {
    return this.db.select(select).from(this.tableName).where(where).whereNull(this.deleteAtKey).first();
  }

  findAll(where, select = this.columns) {
    return this.db.select(select).from(this.tableName).where(where).whereNull(this.deleteAtKey);
  }
}

module.exports = Base;