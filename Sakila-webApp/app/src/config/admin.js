// config/admin.js
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@sakila.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!"; // plain text for now

function getAdminConfig(callback) {
    bcrypt.hash(ADMIN_PASSWORD, 10, (err, hash) => {
        if (err) return callback(err, null);
        callback(null, {
            email: ADMIN_EMAIL,
            password: hash
        });
    });
}

module.exports = getAdminConfig;
