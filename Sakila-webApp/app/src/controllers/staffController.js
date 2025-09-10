const staffService = require('../services/staffService');
const storeRepo = require('../repositories/storeRepository');

module.exports = {
  showInvite: (req, res) => {
        storeRepo.getAll((err, stores) => {
            if (err) {
                console.error('Error fetching stores:', err);
                return res.status(500).send('Error loading invite page');
            }
            res.render('staff/invite', { stores }); // <-- Pass stores to EJS
        });
    },
  invite: (req, res) => {
    const { email, store_id, is_admin, is_manager } = req.body;
    staffService.inviteStaff({ email, store_id, is_admin, is_manager }, (err) => {
      if (err) {
        return res.render('staff/invite', { error: err.message });
      }
      res.redirect('/staff/invite?success=1');
    });
  },

  showOnboard: (req, res) => {
    const token = req.params.token;
    res.render('staff/onboard', { token }); // form to enter name, surname, password
  },

  onboard: (req, res) => {
    const token = req.params.token;
    const { first_name, last_name, password } = req.body;

    staffService.onboardStaff(token, { first_name, last_name, password }, (err) => {
      if (err) {
        return res.render('staff/onboard', { error: err.message, token });
      }
      res.redirect('/login');
    });
  }
};
