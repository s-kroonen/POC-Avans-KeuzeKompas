const db = require('../db/mysql');
const Film = require('../models/Film');

class FilmRepository {
  static list(limit, offset, callback) {
    const sql = `
      SELECT f.film_id, f.title, f.description, f.release_year,
             f.language_id, f.rental_duration, f.rental_rate,
             f.length, f.replacement_cost, f.rating,
             l.name AS language_name
      FROM film f
      JOIN language l ON l.language_id = f.language_id
      ORDER BY f.film_id
      LIMIT ? OFFSET ?
    `;
    db.query(sql, [limit, offset], (err, rows) => {
      if (err) return callback(err);
      callback(null, Film.fromRows(rows));
    });
  }

  static count(callback) {
    const sql = 'SELECT COUNT(*) AS cnt FROM film';
    db.query(sql, (err, rows) => {
      if (err) return callback(err);
      callback(null, rows[0].cnt);
    });
  }

  static findById(id, callback) {
    const sql = `
      SELECT f.film_id, f.title, f.description, f.release_year,
             f.language_id, f.rental_duration, f.rental_rate,
             f.length, f.replacement_cost, f.rating,
             l.name AS language_name
      FROM film f
      JOIN language l ON l.language_id = f.language_id
      WHERE f.film_id = ?
    `;
    db.query(sql, [id], (err, rows) => {
      if (err) return callback(err);
      if (!rows || rows.length === 0) return callback(null, null);
      callback(null, Film.fromRow(rows[0]));
    });
  }
}

module.exports = FilmRepository;
