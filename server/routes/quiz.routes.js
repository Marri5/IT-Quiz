const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

// List all quizzes
router.get('/', (req, res) => {
  res.render('pages/quizzes', { 
    title: 'IT-Quiz - Alle quizzer',
    user: req.session.user || null,
    filter: {},
    quizzes: []
  });
});

// Get quiz by ID to play
router.get('/play/:id', quizController.getQuizById);

// Submit quiz answers
router.post('/submit/:id', quizController.submitQuiz);

// Show quiz results
router.get('/results/:id', quizController.getQuizResults);

// --- Protected Routes (require login) ---

// Create quiz form
router.get('/create', isAuthenticated, (req, res) => {
  res.render('pages/quiz-create', { 
    title: 'IT-Quiz - Lag ny quiz',
    user: req.session.user
  });
});

// Process quiz creation
router.post('/create', isAuthenticated, quizController.createQuiz);

// Edit quiz form
router.get('/edit/:id', isAuthenticated, quizController.getQuizToEdit);

// Process quiz update
router.post('/edit/:id', isAuthenticated, quizController.updateQuiz);

// Delete quiz
router.post('/delete/:id', isAuthenticated, quizController.deleteQuiz);

// User's quizzes
router.get('/my-quizzes', isAuthenticated, quizController.getUserQuizzes);

module.exports = router; 