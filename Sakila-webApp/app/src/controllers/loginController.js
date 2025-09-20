const bcrypt = require('bcryptjs');
const userService = require('../services/userService');
const staffService = require('../services/staffService');
const Customer = require('../models/Customer');
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
          const redirectTo = req.session.redirectTo || '/admin';
          delete req.session.redirectTo;
          return res.redirect(redirectTo);
          return res.redirect('/admin');

        });
      }
      // 1a) Check customer
      if (email === adminConfig.customerEmail) {
        return bcrypt.compare(password, adminConfig.customerPassword, (err, match) => {
          if (err || !match) {
            return res.render('login', { error: 'Invalid password' });
          }

          const adminUser = new Customer({
            staff_id: 0,
            store_id: null,
            first_name: "Customer",
            last_name: "User",
            email: adminConfig.customerEmail,
            address_id: null,
            username: "customer",
            password: adminConfig.customerPassword
          });

          req.session.user = adminUser;
          const redirectTo = req.session.redirectTo || '/profile';
          delete req.session.redirectTo;
          return res.redirect(redirectTo);
          return res.redirect('/admin');

        });
      }

      // 2) Staff login
      staffService.loginStaff({ email, password }, (err, staff) => {
        if (err) return res.render('login', { error: err.message });
        if (staff) {
          req.session.user = staff;
          const redirectTo = req.session.redirectTo || '/profile';
          delete req.session.redirectTo;
          return res.redirect(redirectTo);
          return res.redirect('/profile');
        }

        // 3) Customer fallback
        userService.loginCustomer({ email, password }, (err, customer) => {
          if (err) return res.render('login', { error: err.message });
          if (!customer) return res.render('login', { error: 'No user found with that email' });

          req.session.user = customer;
          const redirectTo = req.session.redirectTo || '/profile';
          delete req.session.redirectTo;
          return res.redirect(redirectTo);
          return res.redirect('/profile');
        });
      });
    });
  },

  logout: (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
  }
};
