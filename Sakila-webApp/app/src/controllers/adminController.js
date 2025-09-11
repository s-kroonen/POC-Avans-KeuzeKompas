module.exports = {
  showDashboard: (req, res) => {
    if (!req.session.user || !req.session.user.is_admin) {
      return res.status(403).send("Forbidden");
    }
    res.render("admin/dashboard", { user: req.session.user });
  },

  manageStores: (req, res) => {
    res.render("admin/manageStores", { user: req.session.user });
  },

  manageManagers: (req, res) => {
    res.render("admin/manageManagers", { user: req.session.user });
  }
};
