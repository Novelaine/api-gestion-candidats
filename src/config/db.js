const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'assistant_rh',
  password: '5432node5432',
  port: 5432,
});

module.exports = pool;
