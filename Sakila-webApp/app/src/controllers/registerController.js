const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

module.exports = {
  showRegister: (req, res) => res.render('register'),

  register: async (req, res) => {
    const { email, password, first_name, last_name, address, city } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    userRepository.createUser({
      email,
      password: hashed,
      first_name,
      last_name,
      address,
      city,
      role: 'customer'
    }, (err, result) => {
      if (err) return res.send('Error creating user');
      res.redirect('/login');
    });
  }
};
