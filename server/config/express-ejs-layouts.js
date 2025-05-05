const expressLayouts = require('express-ejs-layouts');
const path = require('path');

module.exports = (app) => {
  // Set up EJS layouts
  app.use(expressLayouts);
  app.set('layout', 'layouts/main');
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../../views'));
}; 