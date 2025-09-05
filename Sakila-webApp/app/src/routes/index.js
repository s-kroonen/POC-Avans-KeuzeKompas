const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const filmController = require('../controllers/filmController');
// Films
router.get('/', homeController.getHome);
router.get('/films', filmController.list);
router.get('/films/:id', filmController.detail);



const { requireRole } = require('../middleware/auth');

router.get('/admin', requireRole('admin'), (req, res) => {
  res.send('Admin area');
});
router.get('/staff', requireRole('staff'), (req, res) => {
  res.send('Staff area');
});

module.exports = router;
