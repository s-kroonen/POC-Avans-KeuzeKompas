const db = require('../db/mysql');
const Staff = require('../models/Staff');
const StoreRepository = require('./storeRepository');

class StaffRepository {
  static findByEmail(email, callback) {
    const query = 'SELECT * FROM staff WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) return callback(err);
      callback(null, Staff.fromRow(results[0]));
    });
  }

  static findByEmailWithRole(email, callback) {
    this.findByEmail(email, (err, row) => {
      if (err) return callback(err);
      if (!row) return callback(null, null);

      // Always convert raw row to Staff instance
      const staff = Staff.fromRow(row);

      if (staff.is_admin) {
        staff.role = 'admin';
        return callback(null, staff);
      }

      StoreRepository.isManager(staff.id, (err, isManager) => {
        if (err) return callback(err);
        staff.role = isManager ? 'manager' : 'staff';
        callback(null, staff);
      });
    });
  }


  static findById(id, callback) {
    const query = 'SELECT * FROM staff WHERE staff_id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, Staff.fromRow(results[0]));
    });
  }

  static findAll(callback) {
    const query = 'SELECT * FROM staff';
    db.query(query, (err, results) => {
      if (err) return callback(err);
      callback(null, Staff.fromRows(results));
    });
  }
  static createInvitation(data, cb) {
    const sql = `
      INSERT INTO staff_invitations (email, token, store_id, is_admin, is_manager, expires_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [data.email, data.token, data.store_id, data.is_admin, data.is_manager, data.expires_at], cb);
  }

  static findInvitationByToken(token, cb) {
    db.query(`SELECT * FROM staff_invitations WHERE token = ? AND accepted = 0`, [token], (err, rows) => {
      cb(err, rows && rows[0]);
    });
  }

  static markInvitationAccepted(token, cb) {
    db.query(`UPDATE staff_invitations SET accepted = 1 WHERE token = ?`, [token], cb);
  }

  static create(data, callback) {
    const sql = `
      INSERT INTO staff (first_name, last_name, address_id, email, store_id, password, is_admin, active, username)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      data.first_name,
      data.last_name,
      data.address_id,
      data.email,
      data.store_id,
      data.password,
      data.is_admin,
      data.isactive,
      data.username
    ], (err, result) => {
      if (err) return callback(err);
      // Return the newly created staff with ID
      this.findById(result.insertId, callback);
    });
  }

  static update(id, updateData, callback) {
    const query = `
      UPDATE staff
      SET first_name = ?, last_name = ?, email = ?, store_id = ?, is_admin = ?
      WHERE staff_id = ?
    `;
    db.query(query, [
      updateData.first_name,
      updateData.last_name,
      updateData.email,
      updateData.store_id,
      updateData.is_admin,
      id
    ], (err) => {
      if (err) return callback(err);
      this.findById(id, callback);
    });
  }

  static delete(id, callback) {
    const query = 'DELETE FROM staff WHERE staff_id = ?';
    db.query(query, [id], (err, result) => {
      callback(err, result);
    });
  }
}

module.exports = StaffRepository;
