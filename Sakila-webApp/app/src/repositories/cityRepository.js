const db = require('../db/mysql');

module.exports.findOrCreate = (city, country_id, callback) => {
    db.query('SELECT city_id FROM city WHERE city = ? AND country_id = ?', [city, country_id], (err, results) => {
        if (err) return callback(err);
        if (results.length > 0) return callback(null, results[0]);
        db.query('INSERT INTO city (city, country_id) VALUES (?, ?)', [city, country_id], (err, result) => {
            if (err) return callback(err);
            callback(null, { city_id: result.insertId });
        });
    });
};