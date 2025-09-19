const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");


// Dashboard
router.get('/', requireAdmin, adminController.showDashboard);

// ----- STORES -----
router.get('/stores', requireAdmin, adminController.listStores);
router.get('/stores/:id', requireAdmin, adminController.storeDetail);
router.post('/stores/:id', requireAdmin, adminController.saveStore);
router.post('/stores/:id/remove', requireAdmin, adminController.removeStore);

// Staff routes
router.get('/staff', requireAdmin, adminController.listStaff);
router.get('/staff/:id', requireAdmin, adminController.staffDetail);
router.post('/staff/:id', requireAdmin, adminController.saveStaff);
router.post('/staff/:id/remove', requireAdmin, adminController.removeStaff);
module.exports = router;
