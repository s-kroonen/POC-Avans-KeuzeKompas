const AdminService = require('../services/adminService');

module.exports = {
  showDashboard: (req, res) => {
    res.render('admin/dashboard');
  },
  // ----- STORES -----
  listStores: (req, res) => {
    AdminService.getAllStores((err, stores) => {
      if (err) return res.status(500).render('layout', {
        title: 'Error',
        body: `<div class="container py-5"><h1>Error loading stores</h1><p>${err.message}</p></div>`
      });
      res.render('admin/stores', { stores });
    });
  },

  storeDetail: (req, res) => {
    if (req.params.id === "new") {
      return res.render('admin/storeDetail', { store: {} });
    }
    AdminService.getStoreById(req.params.id, (err, store) => {
      if (err || !store) return res.status(404).render('layout', {
        title: 'Not Found',
        body: '<div class="container py-5"><h1>Store Not Found</h1></div>'
      });
      res.render('admin/storeDetail', { store });
    });
  },

  saveStore: (req, res) => {
    AdminService.saveStore(req.body, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).render('layout', {
          title: 'Error',
          body: `<div class="container py-5"><h1>Error saving store</h1><p>${err.message}</p></div>`
        });
      }
      res.redirect('/admin/stores');
    });
  },

  // ----- STAFF -----
  listStaff: (req, res) => {
    AdminService.getAllStaff((err, staff) => {
      if (err) return res.status(500).render('layout', {
        title: 'Error',
        body: `<div class="container py-5"><h1>Error loading staff</h1><p>${err.message}</p></div>`
      });
      AdminService.getAllStores((e2, stores) => {
        res.render('admin/staff', { staff, stores });
      });
    });
  },

  staffDetail: (req, res) => {
    AdminService.getAllStores((e2, stores) => {
      if (req.params.id === "new") {
        return res.render('admin/staffDetail', { staff: {}, stores });
      }
      AdminService.getStaffById(req.params.id, (err, staff) => {
        if (err || !staff) return res.status(404).render('layout', {
          title: 'Not Found',
          body: '<div class="container py-5"><h1>Staff Not Found</h1></div>'
        });
        res.render('admin/staffDetail', { staff, stores });
      });
    });
  },

  saveStaff: (req, res) => {
    AdminService.saveStaff(req.body, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).render('layout', {
          title: 'Error',
          body: `<div class="container py-5"><h1>Error saving staff</h1><p>${err.message}</p></div>`
        });
      }
      res.redirect('/admin/staff');
    });

  }
};
