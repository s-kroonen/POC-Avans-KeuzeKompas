const staffRepo = require('../repositories/staffRepository');

module.exports = {
    inviteStaff: (data, callback) => {
        // Logic to send an invitation to the staff member
        // This could involve sending an email with a registration link
        staffRepo.createInvitation(data, (err, result) => {
            if (err) {
                console.error('Invitation error:', err);
                return callback(new Error('Failed to send invitation'));
            }
            callback(null, result);
        });
    },

    onboardStaff: (data, callback) => {
        // Logic to onboard the staff member after they accept the invitation
        staffRepo.createStaffMember(data, (err, result) => {
            if (err) {
                console.error('Onboarding error:', err);
                return callback(new Error('Failed to onboard staff member'));
            }
            callback(null, result);
        });
    },

    changeStoreManager: (staffId, storeId, callback) => {
        // Logic to change the store manager
        staffRepo.updateStoreManager(staffId, storeId, (err, result) => {
            if (err) {
                console.error('Change manager error:', err);
                return callback(new Error('Failed to change store manager'));
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
    }
};