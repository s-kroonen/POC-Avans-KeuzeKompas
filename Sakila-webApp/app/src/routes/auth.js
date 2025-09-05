// routes/auth.js
const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');

// Login
router.get('/login', loginController.showLogin);
router.post('/login', loginController.login);
router.get('/logout', loginController.logout);

// Register
router.get('/register', registerController.showRegister);
router.post('/register', registerController.register);

module.exports = router;
