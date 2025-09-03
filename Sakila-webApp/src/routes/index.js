const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const filmController = require('../controllers/filmController');

router.get('/', homeController.getHome);
router.get('/films', filmController.list);
router.get('/films/:id', filmController.detail);

module.exports = router;
