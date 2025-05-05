require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Quiz = require('../models/quiz.model');

// Sample quizzes data
const quizzes = require('./quizzes');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://10.12.3.98:27017/it-quiz')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await Quiz.deleteMany({});
    await User.deleteMany({});
    
    console.log('Database cleared');
    
    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@it-utdanning.no',
      password: 'Admin123',
      role: 'admin'
    });
    
    await adminUser.save();
    console.log('Admin user created');
    
    // Create regular user
    const regularUser = new User({
      username: 'bruker',
      email: 'bruker@example.com',
      password: 'Bruker123',
      role: 'user'
    });
    
    await regularUser.save();
    console.log('Regular user created');
    
    // Create quizzes
    for (const quizData of quizzes) {
      const quiz = new Quiz({
        ...quizData,
        author: quizData.isAdminQuiz ? adminUser._id : regularUser._id
      });
      
      await quiz.save();
      
      // Add quiz to user's quizzes
      if (quizData.isAdminQuiz) {
        await User.findByIdAndUpdate(
          adminUser._id,
          { $push: { quizzes: quiz._id } }
        );
      } else {
        await User.findByIdAndUpdate(
          regularUser._id,
          { $push: { quizzes: quiz._id } }
        );
      }
    }
    
    console.log(`${quizzes.length} quizzes created`);
    
    console.log('Database seeded successfully!');
    console.log('\nUser credentials:');
    console.log('Admin - Email: admin@it-utdanning.no, Password: Admin123');
    console.log('User - Email: bruker@example.com, Password: Bruker123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase(); 