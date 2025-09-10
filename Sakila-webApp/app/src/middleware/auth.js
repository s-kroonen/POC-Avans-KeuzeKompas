// middleware/auth.js

// Require any logged-in user
module.exports.requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  next();
};

// Require staff (including admins)
module.exports.requireStaff = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }

  const user = req.session.user;

  // staff objects have is_admin property, customers do not
  if (typeof user.is_admin === 'undefined') {
    return res.status(403).send('Staff access only');
  }

  next();
};


// Require admin (subset of staff)
module.exports.requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }

  if (!req.session.user.is_admin) {
    return res.status(403).send('Admin access only');
  }

  next();
};
