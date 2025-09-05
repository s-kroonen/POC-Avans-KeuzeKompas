const db = require('../db/mysql');

module.exports = {
  findByEmail: (email, cb) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], cb);
  },

  createUser: (user, cb) => {
    const { email, password, first_name, last_name, address, city, role } = user;
    db.query(
      'INSERT INTO users (email, password, first_name, last_name, address, city, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [email, password, first_name, last_name, address, city, role || 'customer'],
      cb
    );
  },

  findById: (id, cb) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], cb);
  }
};
