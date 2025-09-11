
const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");
const { requireAdmin } = require("../middleware/auth");

router.get('/invite', requireAdmin, staffController.showInvite);
router.post('/invite', requireAdmin, staffController.invite);

router.get('/onboard/:token', staffController.showOnboard);
router.post('/onboard/:token', staffController.onboard);

module.exports = router;
