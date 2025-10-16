const { getEnv, IS_DEV } = require('../../common/utils/env')

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: getEnv('DB_HOST'),
    port: getEnv('DB_PORT'),
    user: getEnv('DB_USER'),
    password: getEnv('DB_PASSWORD'),
    database: getEnv('DB_DATABASE')
  }
});

if (IS_DEV) {
  knex.on('query', data => {
    const { sql, bindings } = data;
    console.log(
      '[Knex SQL] →',
      knex.raw(sql, bindings).toString()   // 把占位符填回去
    );
  });
}

module.exports = knex;