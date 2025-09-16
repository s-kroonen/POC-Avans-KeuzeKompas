const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const filmController = require('../controllers/filmController');
const profileController = require('../controllers/profileController');

const { requireLogin, requireStaff, requireAdmin } = require('../middleware/auth');

// Films
router.get('/', homeController.getHome);
router.get('/films', filmController.list);
router.get('/films/:id', filmController.detail);
// Film CRUD
router.get('/films/new', requireStaff, filmController.newForm);
router.post('/films/new', requireStaff, filmController.create);
router.get('/films/:id/edit', requireStaff, filmController.editForm);
router.post('/films/:id/edit', requireStaff, filmController.update);
router.post('/films/:id/delete', requireStaff, filmController.remove);




// router.get('/admin', requireAdmin, (req, res) => {
//   res.send('Admin area');
// });
// router.get('/staff', requireStaff, (req, res) => {
//   res.send('Staff area');
// });

router.get('/profile', requireLogin, profileController.showProfile);

module.exports = router;
