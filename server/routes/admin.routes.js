const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { isAdmin } = require('../middleware/auth.middleware');

// All admin routes require admin authentication
router.use(isAdmin);

// Admin dashboard
router.get('/', adminController.getDashboard);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/user/:id', adminController.getUserById);
router.post('/user/:id/update', adminController.updateUser);
router.post('/user/:id/delete', adminController.deleteUser);

// Quiz management
router.get('/quizzes', adminController.getAllQuizzes);
router.get('/quiz/:id', adminController.getQuizById);
router.post('/quiz/:id/delete', adminController.deleteQuiz);

module.exports = router; 