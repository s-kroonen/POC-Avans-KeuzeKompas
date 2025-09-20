const mysql = require('mysql2');

// Determine environment
const env = process.env.NODE_ENV || 'development';

// Use the test database for dev/test, production DB only in production
const databaseName =
  env === 'production'
    ? process.env.DB_NAME || 'sakila'
    : process.env.DB_NAME || 'sakila_testing';

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: databaseName,
  charset: 'utf8mb4_general_ci',
});

// --- DB Logging / Connection Test ---
if (process.env.NODE_ENV !== 'test') {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('[DB] Connection failed:', err.code, err.message);
      process.exit(1); // fail fast in CI
    } else {
      console.log(`[DB] Connected to database '${databaseName}' at ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      connection.release();
    }
  });
}


function query(sql, params, cb) {
  // Support optional params
  if (typeof params === 'function') {
    cb = params;
    params = [];
  }

  pool.query(sql, params, function (err, results, fields) {
    cb(err, results);
  });
}

module.exports = { query, pool };
