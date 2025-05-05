const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    // Validate password match
    if (password !== confirmPassword) {
      return res.render('pages/register', {
        title: 'IT-Quiz - Registrer deg',
        error: 'Passordene stemmer ikke overens',
        formData: { username, email }
      });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.render('pages/register', {
        title: 'IT-Quiz - Registrer deg',
        error: 'Brukernavn eller e-post er allerede i bruk',
        formData: { username, email }
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password
    });
    
    await user.save();
    
    // Log the user in
    req.session.user = user.toJSON();
    
    // Redirect to home or previous page
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
    
  } catch (error) {
    next(error);
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.render('pages/login', {
        title: 'IT-Quiz - Logg inn',
        error: 'Ugyldig e-post eller passord',
        formData: { email }
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.render('pages/login', {
        title: 'IT-Quiz - Logg inn',
        error: 'Ugyldig e-post eller passord',
        formData: { email }
      });
    }
    
    // Set session
    req.session.user = user.toJSON();
    
    // Redirect to home or previous page
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
    
  } catch (error) {
    next(error);
  }
};

// Logout user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Feil ved utlogging:', err);
    }
    res.redirect('/');
  });
}; 