const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');

router.get('/', quizController.getAllQuizzes);

router.get('/play/:id', quizController.getQuizById);

router.post('/submit/:id', quizController.submitQuiz);

router.get('/results/:id', quizController.getQuizResults);

router.get('/create', isAuthenticated, (req, res) => {
  res.render('pages/quiz-create', { 
    title: 'IT-Quiz - Lag ny quiz',
    user: req.session.user
  });
});

router.post('/create', isAuthenticated, quizController.createQuiz);

router.get('/edit/:id', isAuthenticated, quizController.getQuizToEdit);

router.post('/edit/:id', isAuthenticated, quizController.updateQuiz);

router.post('/delete/:id', isAuthenticated, quizController.deleteQuiz);

router.get('/my-quizzes', isAuthenticated, quizController.getUserQuizzes);

module.exports = router; 