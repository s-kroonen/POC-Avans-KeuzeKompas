const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

module.exports = {
  showLogin: (req, res) => res.render('login'),

  login: (req, res) => {
    const { email, password } = req.body;

    userRepository.findByEmail(email, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.render('login', { error: 'Database error' });
      }
      if (results.length === 0) {
        return res.render('login', { error: 'No user found with that email' });
      }

      const user = results[0];
      bcrypt.compare(password, user.password, (err, match) => {
        if (err || !match) {
          return res.render('login', { error: 'Invalid password' });
        }

        req.session.user = {
          id: user.customer_id,
          name: user.first_name,
          email: user.email,
          role: 'customer'
        };
        res.redirect('/profile');
      });
    });
  },

  logout: (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
  }
};