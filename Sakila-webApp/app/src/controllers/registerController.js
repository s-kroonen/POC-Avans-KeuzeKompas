const userService = require('../services/userService');
const countryRepo = require('../repositories/countryRepository');
const storeRepo = require('../repositories/storeRepository');

module.exports = {
  showRegister: (req, res) => {
    countryRepo.getAll((err, countries) => {
      if (err) {
        console.error('Country fetch failed:', err);
        return res.render('register', { error: 'Could not load countries', countries: [], stores: [] });
      }
      storeRepo.getAll((err2, stores) => {
        if (err2) {
          console.error('Store fetch failed:', err2);
          return res.render('register', { error: 'Could not load stores', countries, stores: [] });
        }
        res.render('register', { countries, stores });
      });
    });
  },

  register: (req, res) => {
    userService.registerCustomer(req.body, (err, result) => {
      if (err) {
        console.error('Register failed:', err);
        countryRepo.getAll((err2, countries) => {
          res.render('register', { error: err.message, countries: countries || [] });
        });
        return;
      }
      res.redirect('/login');
    });
  }
};