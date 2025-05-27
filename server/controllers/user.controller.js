const User = require('../models/user.model');

// Get user profile with populated data
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    
    const user = await User.findById(userId)
      .populate('quizzes')
      .populate('completedQuizzes.quiz');
    
    if (!user) {
      return res.status(404).render('pages/error', {
        title: 'Bruker ikke funnet',
        error: { message: 'Brukeren finnes ikke.' }
      });
    }
    
    res.render('pages/profile', {
      title: 'IT-Quiz - Min profil',
      user: user
    });
    
  } catch (error) {
    next(error);
  }
}; 