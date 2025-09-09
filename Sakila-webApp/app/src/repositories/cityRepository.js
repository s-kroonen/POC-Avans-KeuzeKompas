const db = require('../db/mysql');
const City = require('../models/City');

class CityRepository {
  static findById(id, callback) {
    db.query('SELECT * FROM city WHERE city_id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, City.fromRow(results[0]));
    });
  }

  static findByName(name, callback) {
    db.query('SELECT * FROM city WHERE city = ?', [name], (err, results) => {
      if (err) return callback(err);
      callback(null, City.fromRows(results));
    });
  }

  static getAll(callback) {
    db.query('SELECT * FROM city', (err, results) => {
      if (err) return callback(err);
      callback(null, City.fromRows(results));
    });
  }

  static create(cityData, callback) {
    db.query(
      'INSERT INTO city (city, country_id) VALUES (?, ?)',
      [cityData.city, cityData.country_id],
      (err, result) => {
        if (err) return callback(err);
        this.findById(result.insertId, callback);
      }
    );
  }

  static update(id, cityData, callback) {
    db.query(
      'UPDATE city SET city = ?, country_id = ? WHERE city_id = ?',
      [cityData.city, cityData.country_id, id],
      (err) => {
        if (err) return callback(err);
        this.findById(id, callback);
      }
    );
  }

  static delete(id, callback) {
    db.query('DELETE FROM city WHERE city_id = ?', [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows);
    });
  }
}

module.exports = CityRepository;
