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

  static countConstraints(filmId, cb) {
    const queries = [
      { table: 'film_actor', column: 'film_id' },
      { table: 'film_category', column: 'film_id' },
      { table: 'inventory', column: 'film_id' }
    ];

    let total = 0;
    let done = 0;
    let hasError = false;

    queries.forEach(q => {
      db.query(
        `SELECT COUNT(*) AS cnt FROM ${q.table} WHERE ${q.column} = ?`,
        [filmId],
        (err, results) => {
          if (hasError) return;
          if (err) {
            hasError = true;
            return cb(err);
          }
          total += results[0].cnt;
          done++;
          if (done === queries.length) {
            cb(null, total);
          }
        }
      );
    });
  }

  static deleteForce(id, cb) {
    // Delete payments linked through rentals -> inventory -> film
    const deletePayments = `
    DELETE p FROM payment p
    JOIN rental r ON p.rental_id = r.rental_id
    JOIN inventory i ON r.inventory_id = i.inventory_id
    WHERE i.film_id = ?`;

    const deleteRentals = `
    DELETE r FROM rental r
    JOIN inventory i ON r.inventory_id = i.inventory_id
    WHERE i.film_id = ?`;

    const deleteInventory = `DELETE FROM inventory WHERE film_id=?`;
    const deleteFilmActor = `DELETE FROM film_actor WHERE film_id=?`;
    const deleteFilmCategory = `DELETE FROM film_category WHERE film_id=?`;
    const deleteFilm = `DELETE FROM film WHERE film_id=?`;

    db.query(deletePayments, [id], err => {
      if (err) return cb(err);
      db.query(deleteRentals, [id], err2 => {
        if (err2) return cb(err2);
        db.query(deleteInventory, [id], err3 => {
          if (err3) return cb(err3);
          db.query(deleteFilmActor, [id], err4 => {
            if (err4) return cb(err4);
            db.query(deleteFilmCategory, [id], err5 => {
              if (err5) return cb(err5);
              db.query(deleteFilm, [id], cb);
            });
          });
        });
      });
    });
  }

}

module.exports = FilmRepository;
