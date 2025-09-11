const staffService = require('../services/staffService');
const staffRepo = require('../repositories/staffRepository');
const storeRepo = require('../repositories/storeRepository');
const countryRepo = require('../repositories/countryRepository');
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
        console.error('Error inviting staff:', err);
        return res.render('staff/invite', { error: err.message });
      }
      res.redirect('/staff/invite?success=1');
    });
  },

  showOnboard: (req, res) => {
    const token = req.params.token;

    staffRepo.findInvitationByToken(token, (err, invite) => {
      if (err || !invite) {
        return res.status(400).send("Invalid or expired invitation");
      }

      // fetch countries for the address dropdown
      countryRepo.getAll((err, countries) => {
        if (err) {
          console.error('Failed to load countries:', err);
          return res.render('staff/onboard', {
            invite,
            countries: [],
            error: 'Could not load countries'
          });
        }

        res.render('staff/onboard', {
          invite,
          countries
        });
      });
    });
  },

  onboard: (req, res) => {
    const token = req.params.token;
    const { first_name, last_name, password, username, address, district, city, country, postal_code, phone } = req.body;

    staffService.onboardStaff(token, {
      first_name, last_name, password, username,
      address, district, city, country, postal_code, phone
    }, (err) => {
      if (err) {
        staffRepo.findInvitationByToken(token, (invErr, invite) => {
          if (invErr || !invite) return res.status(400).send("Invalid or expired invitation");

          console.error('Error onboarding staff:', err);

          // fetch countries for the address dropdown
          countryRepo.getAll((err, countries) => {
            if (err) {
              console.error('Failed to load countries:', err);
              return res.render('staff/onboard', { invite, countries: [], error: err.message });
            }

            res.render('staff/onboard', { invite, countries });
          });
        });
        return;
      }

      res.redirect("/login");
    });
  }


};
