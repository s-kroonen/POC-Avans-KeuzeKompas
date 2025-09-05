const db = require('../db/mysql');

module.exports.getAll = (callback) => {
    db.query('SELECT store_id, address_id FROM store', [], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};