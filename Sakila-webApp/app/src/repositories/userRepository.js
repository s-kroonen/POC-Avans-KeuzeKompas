const db = require('../db/mysql');

module.exports = {
  findByEmail: (email, cb) => {
    db.query('SELECT * FROM customer WHERE email = ?', [email], cb);
  },

  findById: (id, cb) => {
    db.query('SELECT * FROM customer WHERE id = ?', [id], cb);
  },
  getCustomerProfile: (customerId, callback) => {
    db.query(
      `SELECT c.first_name, c.last_name, c.email, c.store_id, a.address, ci.city
         FROM customer c
         JOIN address a ON c.address_id = a.address_id
         JOIN city ci ON a.city_id = ci.city_id
         WHERE c.customer_id = ?`,
      [customerId],
      callback
    );
  },

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
