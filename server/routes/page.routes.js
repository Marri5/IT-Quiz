const express = require('express');
const router = express.Router();

// Import middleware
const { isAuthenticated } = require('../middleware/auth.middleware');

// Home page
router.get('/', (req, res) => {
  res.render('pages/home', { 
    title: 'IT-Quiz - Hjem',
    user: req.session.user || null
  });
});

// FAQ page
router.get('/faq', (req, res) => {
  res.render('pages/faq', { 
    title: 'IT-Quiz - FAQ',
    user: req.session.user || null
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', { 
    title: 'IT-Quiz - Om oss',
    user: req.session.user || null
  });
});

// Profile page (requires authentication)
router.get('/profile', isAuthenticated, (req, res) => {
  res.render('pages/profile', { 
    title: 'IT-Quiz - Min profil',
    user: req.session.user
  });
});

module.exports = router; 