const Quiz = require('../models/quiz.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

// Get all quizzes (public)
exports.getAllQuizzes = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = { isPublic: true };
    
    // Filter by category
    if (category && category !== 'alle') {
      query.category = category;
    }
    
    // Filter by difficulty
    if (difficulty && difficulty !== 'alle') {
      query.difficulty = difficulty;
    }
    
    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const quizzes = await Quiz.find(query)
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    
    res.render('pages/quizzes', {
      title: 'IT-Quiz - Alle quizzer',
      quizzes,
      filter: { category, difficulty, search },
      user: req.session.user || null
    });
    
  } catch (error) {
    next(error);
  }
};

// Get quiz by ID to play
exports.getQuizById = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    
    const quiz = await Quiz.findById(quizId)
      .populate('author', 'username');
    
    if (!quiz) {
      return res.status(404).render('pages/error', {
        title: 'Quiz ikke funnet',
        error: { message: 'Quizen du leter etter finnes ikke.' }
      });
    }
    
    // Don't show correct answers when playing
    const playableQuiz = JSON.parse(JSON.stringify(quiz));
    playableQuiz.questions.forEach(question => {
      if (question.questionType === 'multiple-choice' || question.questionType === 'true-false') {
        question.options.forEach(option => {
          delete option.isCorrect;
        });
      }
      delete question.correctAnswer;
      delete question.explanation;
    });
    
    res.render('pages/quiz-play', {
      title: `IT-Quiz - ${quiz.title}`,
      quiz: playableQuiz,
      user: req.session.user || null
    });
    
  } catch (error) {
    next(error);
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const answers = req.body.answers;
    
    const quiz = await Quiz.findById(quizId);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz ikke funnet' });
    }
    
    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      let isCorrect = false;
      totalPoints += question.points;
      
      switch (question.questionType) {
        case 'multiple-choice':
        case 'true-false':
          const correctOption = question.options.findIndex(opt => opt.isCorrect);
          isCorrect = parseInt(userAnswer) === correctOption;
          break;
          
        case 'short-answer':
          isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
          break;
          
        case 'matching':
          isCorrect = userAnswer.every((match, idx) => 
            parseInt(match) === idx
          );
          break;
      }
      
      if (isCorrect) {
        earnedPoints += question.points;
      }
      
      return {
        questionIndex: index,
        isCorrect,
        points: isCorrect ? question.points : 0,
        correctAnswer: getCorrectAnswer(question),
        explanation: question.explanation
      };
    });
    
    const score = {
      earnedPoints,
      totalPoints,
      percentage: Math.round((earnedPoints / totalPoints) * 100)
    };
    
    // Update quiz statistics
    await quiz.updateStats(score.percentage);
    
    // Save result for logged in users
    if (req.session.user) {
      const user = await User.findById(req.session.user._id);
      
      user.completedQuizzes.push({
        quiz: quizId,
        score: score.percentage
      });
      
      await user.save();
    }
    
    // Store results temporarily in session for results page
    req.session.quizResults = {
      quizId,
      score,
      results
    };
    
    res.redirect(`/quiz/results/${quizId}`);
    
  } catch (error) {
    next(error);
  }
};

// Helper function to get correct answer for display
function getCorrectAnswer(question) {
  switch (question.questionType) {
    case 'multiple-choice':
    case 'true-false':
      const correctOption = question.options.find(opt => opt.isCorrect);
      return correctOption ? correctOption.text : '';
      
    case 'short-answer':
      return question.correctAnswer;
      
    case 'matching':
      return question.matchingPairs.map(pair => ({
        left: pair.left,
        right: pair.right
      }));
      
    default:
      return '';
  }
}

// Show quiz results
exports.getQuizResults = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    
    // Get results from session
    if (!req.session.quizResults || req.session.quizResults.quizId !== quizId) {
      return res.redirect(`/quiz/play/${quizId}`);
    }
    
    const { score, results } = req.session.quizResults;
    
    const quiz = await Quiz.findById(quizId)
      .populate('author', 'username');
    
    if (!quiz) {
      return res.status(404).render('pages/error', {
        title: 'Quiz ikke funnet',
        error: { message: 'Quizen du leter etter finnes ikke.' }
      });
    }
    
    res.render('pages/quiz-results', {
      title: `IT-Quiz - Resultater: ${quiz.title}`,
      quiz,
      score,
      results,
      user: req.session.user || null
    });
    
  } catch (error) {
    next(error);
  }
};

// Create new quiz
exports.createQuiz = async (req, res, next) => {
  try {
    const { title, description, category, difficulty, timeLimit, isPublic, questions } = req.body;
    
    // Process questions data
    const processedQuestions = JSON.parse(questions).map(q => {
      // Process based on question type
      switch (q.questionType) {
        case 'multiple-choice':
        case 'true-false':
          q.options = q.options.map(opt => ({
            text: opt.text,
            isCorrect: opt.isCorrect
          }));
          break;
          
        case 'short-answer':
          q.correctAnswer = q.correctAnswer;
          break;
          
        case 'matching':
          q.matchingPairs = q.matchingPairs.map(pair => ({
            left: pair.left,
            right: pair.right
          }));
          break;
      }
      
      return {
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options || [],
        correctAnswer: q.correctAnswer || '',
        matchingPairs: q.matchingPairs || [],
        points: q.points || 1,
        explanation: q.explanation || ''
      };
    });
    
    // Create new quiz
    const quiz = new Quiz({
      title,
      description,
      category,
      difficulty,
      timeLimit: timeLimit || 10,
      isPublic: isPublic === 'true',
      questions: processedQuestions,
      author: req.session.user._id,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
    });
    
    await quiz.save();
    
    // Add quiz to user's quizzes
    await User.findByIdAndUpdate(
      req.session.user._id,
      { $push: { quizzes: quiz._id } }
    );
    
    res.redirect(`/quiz/play/${quiz._id}`);
    
  } catch (error) {
    next(error);
  }
};

// Get quiz to edit
exports.getQuizToEdit = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const userId = req.session.user._id;
    
    const quiz = await Quiz.findOne({
      _id: quizId,
      author: userId
    });
    
    if (!quiz) {
      return res.status(404).render('pages/error', {
        title: 'Quiz ikke funnet',
        error: { message: 'Quizen du leter etter finnes ikke eller du har ikke tilgang til å redigere den.' }
      });
    }
    
    res.render('pages/quiz-edit', {
      title: `IT-Quiz - Rediger: ${quiz.title}`,
      quiz,
      user: req.session.user
    });
    
  } catch (error) {
    next(error);
  }
};

// Update quiz
exports.updateQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const userId = req.session.user._id;
    
    const { title, description, category, difficulty, timeLimit, isPublic, questions } = req.body;
    
    // Process questions data (similar to createQuiz)
    const processedQuestions = JSON.parse(questions).map(q => {
      // Process based on question type (similar to createQuiz)
      switch (q.questionType) {
        case 'multiple-choice':
        case 'true-false':
          q.options = q.options.map(opt => ({
            text: opt.text,
            isCorrect: opt.isCorrect
          }));
          break;
          
        case 'short-answer':
          q.correctAnswer = q.correctAnswer;
          break;
          
        case 'matching':
          q.matchingPairs = q.matchingPairs.map(pair => ({
            left: pair.left,
            right: pair.right
          }));
          break;
      }
      
      return {
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options || [],
        correctAnswer: q.correctAnswer || '',
        matchingPairs: q.matchingPairs || [],
        points: q.points || 1,
        explanation: q.explanation || ''
      };
    });
    
    // Update quiz
    const updatedQuiz = await Quiz.findOneAndUpdate(
      { _id: quizId, author: userId },
      {
        title,
        description,
        category,
        difficulty,
        timeLimit: timeLimit || 10,
        isPublic: isPublic === 'true',
        questions: processedQuestions,
        tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : []
      },
      { new: true }
    );
    
    if (!updatedQuiz) {
      return res.status(404).render('pages/error', {
        title: 'Quiz ikke funnet',
        error: { message: 'Quizen du leter etter finnes ikke eller du har ikke tilgang til å redigere den.' }
      });
    }
    
    res.redirect(`/quiz/play/${updatedQuiz._id}`);
    
  } catch (error) {
    next(error);
  }
};

// Delete quiz
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const userId = req.session.user._id;
    const isAdmin = req.session.user.role === 'admin';
    
    // Set query based on user role
    const query = isAdmin
      ? { _id: quizId }
      : { _id: quizId, author: userId };
    
    const deletedQuiz = await Quiz.findOneAndDelete(query);
    
    if (!deletedQuiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz ikke funnet eller du har ikke tilgang til å slette den.'
      });
    }
    
    // Remove quiz from user's quizzes
    await User.findByIdAndUpdate(
      deletedQuiz.author,
      { $pull: { quizzes: quizId } }
    );
    
    res.json({ success: true });
    
  } catch (error) {
    next(error);
  }
};

// Get user's quizzes
exports.getUserQuizzes = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    
    const user = await User.findById(userId).populate('quizzes');
    
    if (!user) {
      return res.status(404).render('pages/error', {
        title: 'Bruker ikke funnet',
        error: { message: 'Brukeren finnes ikke.' }
      });
    }
    
    res.render('pages/my-quizzes', {
      title: 'IT-Quiz - Mine quizzer',
      quizzes: user.quizzes,
      user: req.session.user
    });
    
  } catch (error) {
    next(error);
  }
}; 