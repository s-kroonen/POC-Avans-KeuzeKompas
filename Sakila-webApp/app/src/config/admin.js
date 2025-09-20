// config/admin.js
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@sakila.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!"; // plain text for now
const CUSTOMER_EMAIL = process.env.CUSTOMER_EMAIL || "customer@sakila.com";
const CUSTOMER_PASSWORD = process.env.CUSTOMER_PASSWORD || "Customer123!"; // plain text for now

function getAdminConfig(callback) {
    bcrypt.hash(ADMIN_PASSWORD, 10, (err, hash) => {
        bcrypt.hash(CUSTOMER_PASSWORD, 10, (err, customerHash) => {

            if (err) return callback(err, null);
            callback(null, {
                email: ADMIN_EMAIL,
                password: hash,
                customerEmail: CUSTOMER_EMAIL,
                customerPassword: customerHash
            });
        });
    });
}

module.exports = getAdminConfig;
