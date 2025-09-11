const bcrypt = require('bcryptjs');
const userService = require('../services/userService');
const staffService = require('../services/staffService');
const Staff = require('../models/Staff');
const getAdminConfig = require('../config/admin');

module.exports = {
  showLogin: (req, res) => res.render('login'),

  login: (req, res) => {
    const { email, password } = req.body;

    getAdminConfig((err, adminConfig) => {
      if (err) {
        return res.render('login', { error: 'Admin loading error' });
      }

      // 1) Check admin
      if (email === adminConfig.email) {
        return bcrypt.compare(password, adminConfig.password, (err, match) => {
          if (err || !match) {
            return res.render('login', { error: 'Invalid password' });
          }

          const adminUser = new Staff({
            staff_id: 0,
            store_id: null,
            first_name: "Admin",
            last_name: "User",
            email: adminConfig.email,
            address_id: null,
            username: "admin",
            password: adminConfig.password,
            is_admin: true
          });

          req.session.user = adminUser;
          return res.redirect('/admin');
        });
      }

      // 2) Staff login
      staffService.loginStaff({ email, password }, (err, staff) => {
        if (err) return res.render('login', { error: err.message });
        if (staff) {
          req.session.user = staff;
          return res.redirect('/profile');
        }

        // 3) Customer fallback
        userService.loginCustomer({ email, password }, (err, customer) => {
          if (err) return res.render('login', { error: err.message });
          if (!customer) return res.render('login', { error: 'No user found with that email' });

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
