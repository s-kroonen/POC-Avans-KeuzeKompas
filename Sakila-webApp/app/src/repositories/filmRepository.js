const db = require('../db/mysql');
const Film = require('../models/Film');

class FilmRepository {
  static search(filters, limit, offset, callback) {
    let sql = `
    SELECT f.film_id, f.title, f.description, f.release_year,
           f.language_id, f.rental_duration, f.rental_rate,
           f.length, f.replacement_cost, f.rating,
           l.name AS language_name
    FROM film f
    JOIN language l ON l.language_id = f.language_id
    WHERE 1=1
  `;
    const params = [];

    if (filters.title) {
      sql += ' AND f.title LIKE ?';
      params.push('%' + filters.title + '%');
    }
    if (filters.rating) {
      sql += ' AND f.rating = ?';
      params.push(filters.rating);
    }
    if (filters.language_id) {
      sql += ' AND f.language_id = ?';
      params.push(filters.language_id);
    }

    sql += ' ORDER BY f.film_id LIMIT ? OFFSET ?';
    params.push(limit, offset);

    db.query(sql, params, (err, rows) => {
      if (err) return callback(err);
      callback(null, Film.fromRows(rows));
    });
  }

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
  static findAllLanguages(callback) {
    const sql = `SELECT language_id, name FROM language ORDER BY name`;
    db.query(sql, (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  }

  static create(film, callback) {
    const sql = `
    INSERT INTO film 
    (title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
    const params = [
      film.title,
      film.description,
      film.release_year,
      film.language_id,
      film.rental_duration,
      film.rental_rate,
      film.length,
      film.replacement_cost,
      film.rating || 'G'
    ];
    db.query(sql, params, (err, result) => {
      if (err) return callback(err);
      callback(null, result.insertId);
    });
  }

  static update(film, callback) {
    const sql = `
    UPDATE film SET
      title = ?, description = ?, release_year = ?, language_id = ?,
      rental_duration = ?, rental_rate = ?, length = ?, replacement_cost = ?, rating = ?
    WHERE film_id = ?
  `;
    const params = [
      film.title,
      film.description,
      film.release_year,
      film.language_id,
      film.rental_duration,
      film.rental_rate,
      film.length,
      film.replacement_cost,
      film.rating,
      film.id
    ];
    db.query(sql, params, (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows);
    });
  }

  static delete(id, callback) {
    const sql = `DELETE FROM film WHERE film_id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) return callback(err);
      callback(null, result.affectedRows);
    });
  }

}

module.exports = FilmRepository;
