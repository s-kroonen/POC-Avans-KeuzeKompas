const mysql = require('mysql');
const pool = mysql.createPool({
connectionLimit: 10,
host: process.env.DB_HOST || '127.0.0.1',
port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME || 'sakila',
charset: 'utf8mb4_general_ci'
});
function query(sql, params, cb) {
// Support optional params
if (typeof params === 'function') {
cb = params; // eslint-disable-line no-param-reassign
params = [];
}
pool.query(sql, params, function (err, results, fields) { // eslintdisable-line no-unused-vars
cb(err, results);
});
}
module.exports = { query, pool };