const AdminService = require('../services/adminService');
const CountryRepo = require('../repositories/countryRepository');
const StoreRepo = require('../repositories/storeRepository');

module.exports = {
  showDashboard: (req, res) => {
    res.render("admin/dashboard");
  },
  // ----- Staff -----
  listStaff: (req, res) => {
    AdminService.getAllStaff((err, staff) => {
      if (err) return res.status(500).send("Error loading staff");
      res.render("admin/staff", { staff });
    });
  },

  staffDetail: (req, res) => {
    StoreRepo.getAll((serr, stores) => {
      if (serr) return res.status(500).send("Error loading stores");
      CountryRepo.getAll((cerr, countries) => {
        if (cerr) return res.status(500).send("Error loading countries");

        if (req.params.id === "new") {
          return res.render("admin/staffDetail", { staff: {}, stores, countries });
        }

        AdminService.getStaffWithAddress(req.params.id, (err, staff) => {
          if (err) return res.status(500).send(err.message);
          res.render("admin/staffDetail", { staff, stores, countries });
        });
      });
    });
  },

  saveStaff: (req, res) => {
    AdminService.saveStaff(req.body, (err) => {
      if (err) return res.status(500).send(err.message);
      res.redirect("/admin/staff");
    });
  },

  removeStaff: (req, res) => {
    AdminService.removeStaff(req.params.id, (err) => {
      if (err) return res.status(500).send(err.message);
      res.redirect("/admin/staff");
    });
  },

  // ----- Stores -----
  listStores: (req, res) => {
    AdminService.getAllStores((err, stores) => {
      if (err) return res.status(500).send("Error loading stores");
      res.render("admin/stores", { stores });
    });
  },

  storeDetail: (req, res) => {
    CountryRepo.getAll((cerr, countries) => {
      if (cerr) return res.status(500).send("Error loading countries");

      AdminService.getAllStaff((serr, staff) => {
        if (serr) return res.status(500).send("Error loading staff");

        if (req.params.id === "new") {
          return res.render("admin/storeDetail", { store: {}, countries, staff });
        }

        AdminService.getStoreWithAddress(req.params.id, (err, store) => {
          if (err) return res.status(500).send(err.message);
          res.render("admin/storeDetail", { store, countries, staff });
        });
      });
    });
  },


  saveStore: (req, res) => {
    AdminService.saveStore(req.body, (err) => {
      if (err) return res.status(500).send(err.message);
      res.redirect("/admin/stores");
    });
  },

  removeStore: (req, res) => {
    AdminService.removeStore(req.params.id, (err) => {
      if (err) return res.status(500).send(err.message);
      res.redirect("/admin/stores");
    });
  }
};
