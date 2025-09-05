// controllers/loginController.js
const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

module.exports = {
  showLogin: (req, res) => res.render('login'),

  login: (req, res) => {
    const { email, password } = req.body;

    userRepository.findByEmail(email, async (err, results) => {
      if (err) return res.send('Database error');
      if (results.length === 0) return res.send('No user found');

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.send('Invalid password');

      req.session.user = {
        id: user.id,
        name: user.first_name,
        role: user.role
      };
      res.redirect('/');
    });
  },

  logout: (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
  }
};
