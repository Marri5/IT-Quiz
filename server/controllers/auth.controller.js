const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
      return res.render('pages/register', {
        title: 'IT-Quiz - Registrer deg',
        error: 'Passordene stemmer ikke overens',
        formData: { username, email },
        user: null
      });
    }
    
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      return res.render('pages/register', {
        title: 'IT-Quiz - Registrer deg',
        error: 'Brukernavn eller e-post er allerede i bruk',
        formData: { username, email },
        user: null
      });
    }
    
    const user = new User({
      username,
      email,
      password
    });
    
    await user.save();
    
    req.session.user = user.toJSON();
    
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
    
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.render('pages/login', {
        title: 'IT-Quiz - Logg inn',
        error: 'Ugyldig e-post eller passord',
        formData: { email },
        user: null
      });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.render('pages/login', {
        title: 'IT-Quiz - Logg inn',
        error: 'Ugyldig e-post eller passord',
        formData: { email },
        user: null
      });
    }
    
    req.session.user = user.toJSON();
    
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);
    
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Feil ved utlogging:', err);
    }
    res.redirect('/');
  });
}; 