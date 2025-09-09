const staffRepo = require('../repositories/staffRepository');
const userRepo = require('../repositories/userRepository');

module.exports = {
    onboardAdmin: (data, callback) => {
        // Create a new admin user
        userRepo.createAdmin(data, (err, result) => {
            if (err) {
                console.error('Admin onboarding failed:', err);
                return callback(new Error('Admin onboarding failed'));
            }
            callback(null, result);
        });
    },

    inviteStaff: (data, callback) => {
        // Send an invitation to the staff member
        staffRepo.invite(data, (err, result) => {
            if (err) {
                console.error('Staff invitation failed:', err);
                return callback(new Error('Staff invitation failed'));
            }
            callback(null, result);
        });
    },

    changeStoreManager: (storeId, newManagerId, callback) => {
        // Change the store manager for a specific store
        staffRepo.updateStoreManager(storeId, newManagerId, (err, result) => {
            if (err) {
                console.error('Failed to change store manager:', err);
                return callback(new Error('Failed to change store manager'));
            }
            callback(null, result);
        });
    },

    addStore: (storeData, callback) => {
        // Add a new store
        staffRepo.addStore(storeData, (err, result) => {
            if (err) {
                console.error('Failed to add store:', err);
                return callback(new Error('Failed to add store'));
            }
            callback(null, result);
        });
    },

    removeStore: (storeId, callback) => {
        // Remove a store
        staffRepo.removeStore(storeId, (err, result) => {
            if (err) {
                console.error('Failed to remove store:', err);
                return callback(new Error('Failed to remove store'));
            }
            callback(null, result);
        });
    }
};