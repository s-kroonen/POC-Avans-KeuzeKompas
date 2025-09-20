const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const session = require("express-session");


const app = express();

// === Middleware ===
app.use(expressLayouts);
app.set('layout', 'layout'); // default layout

// Security & performance
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
      },
    },
  })
);

app.use(compression());
app.use(morgan('dev'));


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

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Static assets
app.use(express.static(path.join(__dirname, 'public')));


// === ROUTES ===
const routes = require('./routes');
const authRoutes = require('./routes/auth');
const adminRoutes = require("./routes/admin");
const staffRoutes = require("./routes/staff");

app.use('/', authRoutes);   // login/register
app.use('/', routes);       // other routes
app.use("/admin", adminRoutes);
app.use("/staff", staffRoutes);

// === 404 Handler ===
app.use(function (req, res) {
    res.status(404).render('layout', {
        title: 'Not Found',
        body: '<div class="container py-5"><h1 class="display-6">404 – Not Found</h1></div>'
    });
});

// === Error Handler ===
// === Error Handler ===
app.use(function (err, req, res, next) {
    console.error('[error]', err);

    // Default status to 500 if not provided
    const status = err.status || 500;
    const message = err.message || 'An unexpected error occurred.';

    res.status(status).render('layout', {
        title: `Error ${status}`,
        body: `<div class="container py-5">
                  <h1 class="display-6">${status === 403 ? 'Access Denied' : 'Server Error'}</h1>
                  <p>${message}</p>
               </div>`
    });
});

module.exports = app;
