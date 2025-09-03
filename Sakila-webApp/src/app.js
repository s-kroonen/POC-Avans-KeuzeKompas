const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const routes = require('./routes');
const app = express();
// Security & perf
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
// Static assets
app.use('/public', express.static(path.join(__dirname, 'public')));
// EJS view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Routes
app.use('/', routes);

// 404
app.use(function (req, res) {
    res.status(404).render('layout', {
        title: 'Not Found',
        body: '<div class="container py-5"><h1 class="display-6">404 – Not Found</h1></div>'
    });
});

// Error handler
app.use(function (err, req, res, next) { // eslint-disable-line no-unusedvars
    console.error('[error]', err);
    res.status(500).render('layout', {
        title: 'Error',
        body: '<div class="container py-5"><h1 class="display-6">Server Error</h1><p>An unexpected error occurred.</p></div>'
    });
});
module.exports = app;