const db = require('../db/mysql');

module.exports = {
    findByName: (country, callback) => {
        db.query('SELECT country_id FROM country WHERE country = ?', [country], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]);
        });
    },

    getAll: (callback) => {
        db.query('SELECT country FROM country ORDER BY country', [], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};