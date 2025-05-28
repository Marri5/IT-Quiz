const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { isAdmin } = require('../middleware/auth.middleware');

router.use(isAdmin);

router.get('/', adminController.getDashboard);

router.get('/users', adminController.getAllUsers);
router.get('/user/:id', adminController.getUserById);
router.post('/user/:id/update', adminController.updateUser);
router.post('/user/:id/delete', adminController.deleteUser);

router.get('/quizzes', adminController.getAllQuizzes);
router.get('/quiz/:id', adminController.getQuizById);
router.post('/quiz/:id/delete', adminController.deleteQuiz);

module.exports = router; 