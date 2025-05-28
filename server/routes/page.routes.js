const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

router.get('/', (req, res) => {
  res.render('pages/home', { 
    title: 'IT-Quiz - Hjem',
    user: req.session.user || null
  });
});

router.get('/faq', (req, res) => {
  res.render('pages/faq', { 
    title: 'IT-Quiz - FAQ',
    user: req.session.user || null
  });
});

router.get('/profile', isAuthenticated, userController.getProfile);

module.exports = router; 