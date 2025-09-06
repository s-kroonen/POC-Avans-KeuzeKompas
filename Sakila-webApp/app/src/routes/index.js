const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const filmController = require('../controllers/filmController');
const profileController = require('../controllers/profileController');

// Films
router.get('/', homeController.getHome);
router.get('/films', filmController.list);
router.get('/films/:id', filmController.detail);



const { requireLogin } = require('../middleware/auth');
const { requireRole } = require('../middleware/auth');

router.get('/admin', requireRole('admin'), (req, res) => {
  res.send('Admin area');
});
router.get('/staff', requireRole('staff'), (req, res) => {
  res.send('Staff area');
});

router.get('/profile', requireLogin, profileController.showProfile);

module.exports = router;
