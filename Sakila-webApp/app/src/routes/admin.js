const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAdmin } = require("../middleware/auth");


router.get("/", requireAdmin, adminController.showDashboard);
router.get("/manageStores", requireAdmin, adminController.manageStores);
router.get("/manageManagers", requireAdmin, adminController.manageManagers);

module.exports = router;
