const userRepo = require('../repositories/userRepository');
const Customer = require('../models/Customer');
const Staff = require('../models/Staff');

module.exports.showProfile = (req, res) => {
    const user = req.session.user;
    if (!user) return res.redirect('/login');

    if (user.role === 'customer') {
        // Fetch customer profile details
        userRepo.getProfile(user.id, (err, results) => {
            if (err || results.length === 0) {
                return res.render('users/profile', { error: 'Could not load profile', user });
            }
            Object.assign(user, results[0]);
            res.render('users/profile', { user });
        });
    } else {
        // Staff/admin/manager
        // You can fetch more details if needed, or just render
        res.render('users/profile', { user });
    }
};