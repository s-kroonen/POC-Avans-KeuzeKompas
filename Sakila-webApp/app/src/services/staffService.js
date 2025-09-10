const staffRepo = require('../repositories/staffRepository');
const bcrypt = require('bcryptjs');

module.exports = {
    inviteStaff: (data, callback) => {
        // Logic to send an invitation to the staff member
        // This could involve sending an email with a registration link
        // todo: implement email sending
    },

    onboardStaff: (data, callback) => {
        // Logic to onboard the staff member after they accept the invitation
        staffRepo.create(data, (err, result) => {
            if (err) {
                console.error('Onboarding error:', err);
                return callback(new Error('Failed to onboard staff member'));
            }
            callback(null, result);
        });
    },

    removeStaff: (staffId, callback) => {
        // Logic to remove a staff member
        staffRepo.deleteStaffMember(staffId, (err, result) => {
            if (err) {
                console.error('Remove staff error:', err);
                return callback(new Error('Failed to remove staff member'));
            }
            callback(null, result);
        });
    },
    loginStaff: (data, callback) => {
        staffRepo.findByEmailWithRole(data.email, (err, staff) => {
            if (err) {
                console.error('Staff login error:', err);
                return callback(new Error('Database error'));
            }
            if (!staff) {
                return callback(null, null); // No staff found
            }
            // Compare password
            bcrypt.compare(data.password, staff.password, (err, match) => {
                if (err || !match) {
                    console.error('Staff password error:', err);
                    return callback(new Error('Invalid password'));
                }
                // Successful login
                return callback(null, staff);
            });
        });
    }
    
};