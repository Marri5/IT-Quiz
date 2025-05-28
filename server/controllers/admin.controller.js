const User = require('../models/user.model');
const Quiz = require('../models/quiz.model');
const mongoose = require('mongoose');

exports.getDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();
    const totalPlays = await Quiz.aggregate([
      { $group: { _id: null, totalPlays: { $sum: '$plays' } } }
    ]);
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    const popularQuizzes = await Quiz.find()
      .sort({ plays: -1 })
      .populate('author', 'username')
      .limit(5);
    
    res.render('pages/admin/dashboard', {
      title: 'IT-Quiz - Admin Dashboard',
      stats: {
        totalUsers,
        totalQuizzes,
        totalPlays: totalPlays.length > 0 ? totalPlays[0].totalPlays : 0
      },
      recentUsers,
      popularQuizzes,
      user: req.session.user
    });
    
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 });
    
    res.render('pages/admin/users', {
      title: 'IT-Quiz - Admin: Alle brukere',
      users,
      user: req.session.user
    });
    
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    const userWithQuizzes = await User.findById(userId)
      .populate('quizzes')
      .populate('completedQuizzes.quiz');
    
    if (!userWithQuizzes) {
      return res.status(404).render('pages/error', {
        title: 'Bruker ikke funnet',
        error: { message: 'Brukeren finnes ikke.' },
        user: req.session.user || null
      });
    }
    
    res.render('pages/admin/user-detail', {
      title: `IT-Quiz - Admin: Bruker ${userWithQuizzes.username}`,
      profileUser: userWithQuizzes,
      user: req.session.user
    });
    
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { username, email, role } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        username,
        email,
        role
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).render('pages/error', {
        title: 'Bruker ikke funnet',
        error: { message: 'Brukeren finnes ikke.' },
        user: req.session.user || null
      });
    }
    
    res.redirect('/admin/users');
    
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    
    if (userId === req.session.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Du kan ikke slette din egen brukerkonto.'
      });
    }
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'Brukeren finnes ikke.'
      });
    }
    
    await Quiz.deleteMany({ author: userId });
    
    res.json({ success: true });
    
  } catch (error) {
    next(error);
  }
};

exports.getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    res.render('pages/admin/quizzes', {
      title: 'IT-Quiz - Admin: Alle quizzer',
      quizzes,
      user: req.session.user
    });
    
  } catch (error) {
    next(error);
  }
};

exports.getQuizById = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    
    const quiz = await Quiz.findById(quizId)
      .populate('author', 'username');
    
    if (!quiz) {
      return res.status(404).render('pages/error', {
        title: 'Quiz ikke funnet',
        error: { message: 'Quizen du leter etter finnes ikke.' },
        user: req.session.user || null
      });
    }
    
    res.render('pages/admin/quiz-detail', {
      title: `IT-Quiz - Admin: Quiz ${quiz.title}`,
      quiz,
      user: req.session.user
    });
    
  } catch (error) {
    next(error);
  }
};

exports.deleteQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    
    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    
    if (!deletedQuiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz ikke funnet.'
      });
    }
    
    await User.findByIdAndUpdate(
      deletedQuiz.author,
      { $pull: { quizzes: quizId } }
    );
    
    res.json({ success: true });
    
  } catch (error) {
    next(error);
  }
}; 