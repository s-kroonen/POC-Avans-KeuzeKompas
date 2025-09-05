const db = require('../db/mysql');

module.exports = {
  findByEmail: (email, cb) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], cb);
  },

  findById: (id, cb) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], cb);
  },

  // filepath: [userRepository.js](http://_vscodecontentref_/0)
  createCustomer: (customer, callback) => {
    const sql = `
      INSERT INTO customer (store_id, first_name, last_name, email, address_id, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      customer.store_id,
      customer.first_name,
      customer.last_name,
      customer.email,
      customer.address_id,
      customer.password
    ], callback);
  }
};
