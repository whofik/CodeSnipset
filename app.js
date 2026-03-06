require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const path = require('path');

const indexRoutes = require('./routes/index');
const filesRoutes = require('./routes/files');
const apiRoutes = require('./routes/api');
const adminRoutes = require('./routes/admin');
const actionsRoutes = require('./routes/actions');
const { setupRateLimiter } = require('./middleware/rateLimit');

const app = express();
const PORT = process.env.port || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());

setupRateLimiter(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  console.log(new Date().toISOString() + ' - ' + req.method + ' ' + req.path);
  res.locals.whatsapp = process.env.whatsapp || 'https://whatsapp.com';
  res.locals.telegram = process.env.telegram || 'https://telegram.org';
  res.locals.instagram = process.env.instagram || 'https://instagram.com';
  next();
});

app.use('/', indexRoutes);
app.use('/files', filesRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/actions', actionsRoutes);

app.use(function(req, res) {
  res.status(404).render('404');
});

app.use(function(err, req, res, next) {
  console.error('Error: ' + err.message);
  res.status(500).render('file', {
    title: 'Error',
    description: 'Terjadi kesalahan',
    code: null,
    filename: null,
    lines: null,
    error: err.message
  });
});

app.listen(PORT, function() {
  console.log('Server running on port ' + PORT);
});

module.exports = app;
