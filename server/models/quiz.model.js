const mongoose = require('mongoose');

// Schema for a single question
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
  // For short-answer questions
  correctAnswer: {
    type: String,
    default: ''
  },
  // For matching questions
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

// Main Quiz schema
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
    type: Number, // In minutes
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

// Virtual for calculating total points
quizSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

// Method to update average score when a quiz is completed
quizSchema.methods.updateStats = function(score) {
  const currentTotal = this.plays * this.averageScore;
  this.plays += 1;
  this.averageScore = (currentTotal + score) / this.plays;
  return this.save();
};

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz; 