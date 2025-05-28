const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

router.get('/login', (req, res) => {
  res.render('pages/login', { 
    title: 'IT-Quiz - Logg inn',
    user: null
  });
});

router.post('/login', authController.login);

router.get('/register', (req, res) => {
  res.render('pages/register', { 
    title: 'IT-Quiz - Registrer deg',
    user: null
  });
});

router.post('/register', authController.register);

router.get('/logout', isAuthenticated, authController.logout);

module.exports = router; 