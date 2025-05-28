const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'short-answer', 'matching'],
    default: 'multiple-choice'
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: String,
    default: ''
  },
  matchingPairs: [{
    left: String,
    right: String
  }],
  points: {
    type: Number,
    default: 1
  },
  explanation: {
    type: String,
    default: ''
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['programutvikling', 'drift', 'nettverk', 'database', 'annet'],
    default: 'annet'
  },
  difficulty: {
    type: String,
    enum: ['enkel', 'middels', 'vanskelig'],
    default: 'middels'
  },
  questions: [questionSchema],
  timeLimit: {
    type: Number,
    default: 10
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plays: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

quizSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

quizSchema.methods.updateStats = function(score) {
  const currentTotal = this.plays * this.averageScore;
  this.plays += 1;
  this.averageScore = (currentTotal + score) / this.plays;
  return this.save();
};

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz; 