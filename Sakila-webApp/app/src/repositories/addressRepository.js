const db = require('../db/mysql');
const Address = require('../models/Address');

class AddressRepository {
  static findById(id, callback) {
    db.query('SELECT * FROM address WHERE address_id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, Address.fromRow(results[0]));
    });
  }

  static findByFields({ address, district, city_id, postal_code = '', phone = '' }, callback) {
    const sql = `
      SELECT * FROM address
      WHERE address = ? AND district = ? AND city_id = ? AND postal_code = ? AND phone = ?
    `;
    db.query(sql, [address, district, city_id, postal_code, phone], (err, results) => {
      if (err) return callback(err);
      callback(null, Address.fromRows(results));
    });
  }

  static create(addressData, callback) {
    const sql = `
      INSERT INTO address (address, address2, district, city_id, postal_code, phone, location)
      VALUES (?, ?, ?, ?, ?, ?, ST_GeomFromText(?))
    `;
    db.query(sql, [
      addressData.address,
      addressData.address2 || '',
      addressData.district,
      addressData.city_id,
      addressData.postal_code || '',
      addressData.phone || '',
      'POINT(0 0)'
    ], (err, result) => {
      if (err) return callback(err);
      this.findById(result.insertId, callback);
    });
  }

  static update(id, updateData, callback) {
    db.query('UPDATE address SET ? WHERE address_id = ?', [updateData, id], (err) => {
      if (err) return callback(err);
      this.findById(id, callback);
    });
  }

  static delete(id, callback) {
    db.query('DELETE FROM address WHERE address_id = ?', [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows);
    });
  }

  static findAll(callback) {
    db.query('SELECT * FROM address', (err, results) => {
      if (err) return callback(err);
      callback(null, Address.fromRows(results));
    });
  }

  static findOrCreate(addressData, callback) {
    this.findByFields(addressData, (err, matches) => {
      if (err) return callback(err);
      if (matches.length > 0) return callback(null, matches[0]); // return existing
      this.create(addressData, callback); // otherwise create new
    });
  }
}

module.exports = AddressRepository;
