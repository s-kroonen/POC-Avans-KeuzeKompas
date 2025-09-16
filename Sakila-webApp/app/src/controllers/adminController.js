const AdminService = require('../services/adminService');
const countryRepo = require('../repositories/countryRepository');
const cityRepo = require('../repositories/cityRepository');
const addressRepo = require('../repositories/addressRepository');

module.exports = {
  manageStores: (req, res) => {
    AdminService.getStores((err, stores) => {
      if (err) return res.status(500).send("Error loading stores");
      res.render("admin/manageStores", { user: req.session.user, stores });
    });
  },

  createStore: (req, res) => {
    const data = req.body;
    // build address first
    countryRepo.findByName(data.country, (err, country) => {
      if (err || !country) return res.render("admin/manageStores", { error: "Country not found", stores: [] });

      cityRepo.create({ city: data.city, country_id: country.country_id }, (err, city) => {
        if (err || !city) return res.render("admin/manageStores", { error: "City error", stores: [] });

        addressRepo.findOrCreate({
          address: data.address,
          district: data.district,
          postal_code: data.postal_code,
          phone: data.phone,
          city_id: city.city_id
        }, (err, address) => {
          if (err || !address) return res.render("admin/manageStores", { error: "Address error", stores: [] });

          AdminService.addStore({
            managerStaffId: data.managerStaffId,
            addressId: address.address_id
          }, (err) => {
            if (err) return res.render("admin/manageStores", { error: err.message, stores: [] });
            res.redirect("/admin/manageStores");
          });
        });
      });
    });
  },

  showDashboard: (req, res) => {
    if (!req.session.user || !req.session.user.is_admin) {
      return res.status(403).send("Forbidden");
    }
    res.render("admin/dashboard", { user: req.session.user });
  },

  // manageStores: (req, res) => {
  //   res.render("admin/manageStores", { user: req.session.user });
  // },

  manageStaff: (req, res) => {
    res.render("admin/manageStaff", { user: req.session.user });
  }
};
