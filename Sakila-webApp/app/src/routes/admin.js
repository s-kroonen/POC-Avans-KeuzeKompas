const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");


// Dashboard
router.get('/dashboard', requireAdmin, adminController.showDashboard);

// ----- STORES -----
router.get('/manageStores', requireAdmin, adminController.manageStores);
router.post('/stores', requireAdmin, adminController.createStore);
// router.post('/stores/:id/remove', requireAdmin, adminController.removeStore);

// ----- STAFF -----
router.get('/manageStaff', requireAdmin, adminController.manageStaff);
// router.post('/staff', requireAdmin, adminController.createStaff);
// router.post('/remove-staffMember/:id', requireAdmin, adminController.removeStaff);

module.exports = router;
