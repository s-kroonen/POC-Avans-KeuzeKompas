const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");


// Dashboard
router.get('/', adminController.showDashboard);

// ----- STORES -----
router.get('/stores', adminController.listStores);
router.get('/stores/:id', adminController.storeDetail);
router.post('/stores/:id', adminController.saveStore);

// Staff routes
router.get('/staff', adminController.listStaff);
router.get('/staff/:id', adminController.staffDetail);
router.post('/staff/:id', adminController.saveStaff);

module.exports = router;
