const userRepo = require('../repositories/userRepository');

module.exports.showProfile = (req, res) => {
    const customerId = req.session.user.id;
    userRepo.getCustomerProfile(customerId, (err, results) => {
        if (err || results.length === 0) {
            console.error('Profile fetch error:', err);
            return res.render('users/profile', { error: 'Could not load profile', user: {} });
        }
        const user = Object.assign({}, req.session.user, results[0]);
        res.render('users/profile', { user });
    });
};