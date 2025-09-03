const db = require('../db/mysql');
function listFilms(limit, offset, cb) {
    const sql = `
        SELECT f.film_id, f.title, f.description, f.release_year, l.name AS
        language_name,
        f.length, f.rating
        FROM film f
        JOIN language l ON l.language_id = f.language_id
        ORDER BY f.film_id
        LIMIT ? OFFSET ?`;
    db.query(sql, [limit, offset], cb);
}


function countFilms(cb) {
    db.query('SELECT COUNT(*) AS cnt FROM film', function (err, rows) {
        if (err) return cb(err);
        cb(null, rows[0].cnt);
    });
}
function getFilmById(id, cb) {
    const sql = `
        SELECT f.*, l.name AS language_name
        FROM film f
        JOIN language l ON l.language_id = f.language_id
        WHERE f.film_id = ?`;
    db.query(sql, [id], function (err, rows) {
        if (err) return cb(err);
        if (!rows || rows.length === 0) return cb(null, null);
        cb(null, rows[0]);
    });
}
module.exports = { listFilms, countFilms, getFilmById };