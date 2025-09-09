const bcrypt = require('bcryptjs');
const StaffRepository = require('../repositories/staffRepository');
const CustomerRepository = require('../repositories/userRepository');

module.exports = {
  showLogin: (req, res) => res.render('login'),

  login: (req, res) => {
    const { email, password } = req.body;

    // Try staff first
    StaffRepository.findByEmailWithRole(email, (err, staff) => {
      if (err) return res.render('login', { error: 'Database error' });

      if (staff) {
        return bcrypt.compare(password, staff.password, (err, match) => {
          if (err || !match) return res.render('login', { error: 'Invalid password' });

          req.session.user = staff;
          return res.redirect('/profile');
        });
      }

      // Fall back to customer
      CustomerRepository.findByEmail(email, (err, customer) => {
        if (err) return res.render('login', { error: 'Database error' });
        if (!customer) return res.render('login', { error: 'No user found with that email' });

        bcrypt.compare(password, customer.password, (err, match) => {
          if (err || !match) return res.render('login', { error: 'Invalid password' });
          customer.role = 'customer';
          req.session.user = customer;
          return res.redirect('/profile');
        });
      });
    });
  },

  logout: (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
  }
};
