// middleware/auth.js
module.exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      // No session or no user → redirect to login
      return res.redirect('/login');
    }

    if (req.session.user.role !== role) {
      // Logged in but wrong role
      return res.status(403).send('Forbidden');
    }

    next();
  };
};
module.exports.requireLogin = (req, res, next) => {
  if (!req.session || !req.session.user) {
    return res.redirect('/login');
  }
  next();
};