const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  // Redirect to login if not authenticated
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login');
};

// Check if user is an admin
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  
  // Return 403 if not admin
  res.status(403).render('pages/error', {
    title: 'Ikke tilgang',
    error: { message: 'Du har ikke tilgang til denne siden.' }
  });
};

// Check if user is the quiz owner or an admin
exports.isQuizOwnerOrAdmin = async (req, res, next) => {
  try {
    // Get quiz ID from parameters
    const quizId = req.params.id;
    
    // Check if user is authenticated
    if (!req.session || !req.session.user) {
      req.session.returnTo = req.originalUrl;
      return res.redirect('/auth/login');
    }
    
    const user = req.session.user;
    
    // If admin, allow access
    if (user.role === 'admin') {
      return next();
    }
    
    // Find the quiz
    const Quiz = require('../models/quiz.model');
    const quiz = await Quiz.findById(quizId);
    
    // Check if quiz exists
    if (!quiz) {
      return res.status(404).render('pages/error', {
        title: 'Quiz ikke funnet',
        error: { message: 'Quizen du leter etter finnes ikke.' }
      });
    }
    
    // Check if user is the quiz owner
    if (quiz.author.toString() === user._id.toString()) {
      return next();
    }
    
    // Not authorized
    res.status(403).render('pages/error', {
      title: 'Ikke tilgang',
      error: { message: 'Du har ikke tilgang til å redigere denne quizen.' }
    });
    
  } catch (error) {
    next(error);
  }
}; 