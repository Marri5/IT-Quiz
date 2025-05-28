const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login');
};

exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  
  res.status(403).render('pages/error', {
    title: 'Ikke tilgang',
    error: { message: 'Du har ikke tilgang til denne siden.' },
    user: req.session.user || null
  });
};

exports.isQuizOwnerOrAdmin = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    
    if (!req.session || !req.session.user) {
      req.session.returnTo = req.originalUrl;
      return res.redirect('/auth/login');
    }
    
    const user = req.session.user;
    
    if (user.role === 'admin') {
      return next();
    }
    
    const Quiz = require('../models/quiz.model');
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).render('pages/error', {
        title: 'Quiz ikke funnet',
        error: { message: 'Quizen du leter etter finnes ikke.' },
        user: req.session.user || null
      });
    }
    
    if (quiz.author.toString() === user._id.toString()) {
      return next();
    }
    
    res.status(403).render('pages/error', {
      title: 'Ikke tilgang',
      error: { message: 'Du har ikke tilgang til å redigere denne quizen.' },
      user: req.session.user || null
    });
    
  } catch (error) {
    next(error);
  }
}; 