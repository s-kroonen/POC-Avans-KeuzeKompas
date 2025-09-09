const db = require('../db/mysql');
const Customer = require('../models/Customer');

class CustomerRepository {
  static findByEmail(email, callback) {
    db.query('SELECT * FROM customer WHERE email = ?', [email], (err, results) => {
      if (err) return callback(err);
      callback(null, Customer.fromRow(results[0]));
    });
  }

  static findById(id, callback) {
    db.query('SELECT * FROM customer WHERE customer_id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, Customer.fromRow(results[0]));
    });
  }

  static getProfile(customerId, callback) {
    db.query(
      `SELECT c.customer_id, c.first_name, c.last_name, c.email, c.store_id,
              a.address, ci.city
         FROM customer c
         JOIN address a ON c.address_id = a.address_id
         JOIN city ci ON a.city_id = ci.city_id
         WHERE c.customer_id = ?`,
      [customerId],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results[0] || null);
      }
    );
  }

  static create(customerData, callback) {
    const sql = `
      INSERT INTO customer (store_id, first_name, last_name, email, address_id, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        customerData.storeId,
        customerData.firstName,
        customerData.lastName,
        customerData.email,
        customerData.addressId,
        customerData.password,
      ],
      (err, result) => {
        if (err) return callback(err);
        this.findById(result.insertId, callback);
      }
    );
  }

  static update(id, customerData, callback) {
    db.query(
      'UPDATE customer SET ? WHERE customer_id = ?',
      [customerData, id],
      (err) => {
        if (err) return callback(err);
        this.findById(id, callback);
      }
    );
  }

  static delete(id, callback) {
    db.query('DELETE FROM customer WHERE customer_id = ?', [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows);
    });
  }

  static getAll(callback) {
    db.query('SELECT * FROM customer', (err, results) => {
      if (err) return callback(err);
      callback(null, Customer.fromRows(results));
    });
  }
}

module.exports = CustomerRepository;
