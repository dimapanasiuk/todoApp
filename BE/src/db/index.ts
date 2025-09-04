const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',       // ваш пользователь PostgreSQL
  host: 'localhost',      // хост
  database: 'todo',       // имя базы
  password: '0000',       // ваш пароль
  port: 5432,             // порт PostgreSQL
});

module.exports = pool;