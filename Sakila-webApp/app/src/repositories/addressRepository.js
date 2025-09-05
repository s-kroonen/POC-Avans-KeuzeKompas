const db = require('../db/mysql');

module.exports.findOrCreate = (address, city_id, callback) => {
    // Check if address exists
    db.query(
        'SELECT address_id FROM address WHERE address = ? AND district = ? AND city_id = ? AND postal_code = ? AND phone = ?',
        [
            address.address,
            address.district,
            city_id,
            address.postal_code || '',
            address.phone || ''
        ],
        (err, results) => {
            if (err) return callback(err);
            if (results.length > 0) {
                // Address exists, return its ID
                return callback(null, { address_id: results[0].address_id});
            }
            // Otherwise, create new address
            db.query(
                'INSERT INTO address (address, district, city_id, postal_code, phone, location) VALUES (?, ?, ?, ?, ?, ST_GeomFromText(?))',
                [
                    address.address,
                    address.district,
                    city_id,
                    address.postal_code || '',
                    address.phone || '',
                    'POINT(0 0)'
                ],
                (err, result) => {
                    if (err) return callback(err);
                    callback(null, { address_id: result.insertId });
                }
            );
        }
    );
};