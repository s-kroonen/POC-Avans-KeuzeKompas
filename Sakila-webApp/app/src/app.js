const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require("express-session");

const routes = require('./routes');
const authRoutes = require('./routes/auth');

const app = express();

app.use(expressLayouts);
app.set('layout', 'layout'); // default layout

// Security & performance
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

// Static assets
app.use('/public', express.static(path.join(__dirname, 'public')));

// EJS view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body parser
app.use(express.urlencoded({ extended: true }));

// === SESSION MUST COME BEFORE ROUTES ===
app.use(session({
    secret: "authsqlsakila",
    resave: false,
    saveUninitialized: false
}));

// === ROUTES ===
app.use('/', authRoutes);   // login/register
app.use('/', routes);       // other routes

// === 404 Handler ===
app.use(function (req, res) {
    res.status(404).render('layout', {
        title: 'Not Found',
        body: '<div class="container py-5"><h1 class="display-6">404 – Not Found</h1></div>'
    });
});

// === Error Handler ===
app.use(function (err, req, res, next) {
    console.error('[error]', err);
    res.status(500).render('layout', {
        title: 'Error',
        body: '<div class="container py-5"><h1 class="display-6">Server Error</h1><p>An unexpected error occurred.</p></div>'
    });
});

module.exports = app;
