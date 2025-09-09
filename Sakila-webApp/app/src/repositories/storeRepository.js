const db = require('../db/mysql');
const Store = require('../models/Store');

class StoreRepository {
  static getAll(callback) {
    db.query('SELECT * FROM store', (err, results) => {
      if (err) return callback(err);
      callback(null, Store.fromRows(results));
    });
  }

  static getById(storeId, callback) {
    db.query('SELECT * FROM store WHERE store_id = ?', [storeId], (err, results) => {
      if (err) return callback(err);
      callback(null, Store.fromRow(results[0]));
    });
  }

  static create(storeData, callback) {
    db.query(
      'INSERT INTO store (manager_staff_id, address_id) VALUES (?, ?)',
      [storeData.managerStaffId, storeData.addressId],
      (err, result) => {
        if (err) return callback(err);
        this.getById(result.insertId, callback);
      }
    );
  }

  static update(storeId, storeData, callback) {
    db.query(
      'UPDATE store SET manager_staff_id = ?, address_id = ? WHERE store_id = ?',
      [storeData.managerStaffId, storeData.addressId, storeId],
      (err) => {
        if (err) return callback(err);
        this.getById(storeId, callback);
      }
    );
  }

  static delete(storeId, callback) {
    db.query('DELETE FROM store WHERE store_id = ?', [storeId], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows);
    });
  }
  static isManager(staffId, callback) {
    db.query('SELECT * FROM stores WHERE manager_staff_id = ?', [staffId], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0);
    });
  }
}

module.exports = StoreRepository;
