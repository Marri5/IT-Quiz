const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

// Display login form
router.get('/login', (req, res) => {
  res.render('pages/login', { 
    title: 'IT-Quiz - Logg inn',
    user: null
  });
});

// Process login
router.post('/login', authController.login);

// Display registration form
router.get('/register', (req, res) => {
  res.render('pages/register', { 
    title: 'IT-Quiz - Registrer deg',
    user: null
  });
});

// Process registration
router.post('/register', authController.register);

// Logout
router.get('/logout', isAuthenticated, authController.logout);

module.exports = router; 