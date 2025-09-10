// config/admin.js
const bcrypt = require('bcryptjs');

// For demo, store plain text password in env, hash it on boot
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@sakila.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!"; // plain text for now

const hashedPassword = bcrypt.hash(ADMIN_PASSWORD, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing admin password:', err);
        return null;
    } else {
        return hash;
    }
});
module.exports = {
    email: ADMIN_EMAIL,
    password: hashedPassword
};
