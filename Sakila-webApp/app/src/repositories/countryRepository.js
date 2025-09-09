const db = require('../db/mysql');
const Country = require('../models/Country');

class CountryRepository {
  static getAll(callback) {
    db.query('SELECT * FROM country', (err, results) => {
      if (err) return callback(err);
      callback(null, Country.fromRows(results));
    });
  }

  static findById(id, callback) {
    db.query('SELECT * FROM country WHERE country_id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, Country.fromRow(results[0]));
    });
  }

  static findByName(name, callback) {
    db.query('SELECT * FROM country WHERE country = ?', [name], (err, results) => {
      if (err) return callback(err);
      callback(null, Country.fromRows(results));
    });
  }

  static create(countryData, callback) {
    db.query(
      'INSERT INTO country (country) VALUES (?)',
      [countryData.country],
      (err, result) => {
        if (err) return callback(err);
        this.findById(result.insertId, callback);
      }
    );
  }

  static update(id, countryData, callback) {
    db.query(
      'UPDATE country SET country = ? WHERE country_id = ?',
      [countryData.country, id],
      (err) => {
        if (err) return callback(err);
        this.findById(id, callback);
      }
    );
  }

  static delete(id, callback) {
    db.query('DELETE FROM country WHERE country_id = ?', [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows);
    });
  }
}

module.exports = CountryRepository;
