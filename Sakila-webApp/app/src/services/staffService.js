const staffRepo = require('../repositories/staffRepository');
const bcrypt = require('bcryptjs');

module.exports = {
    inviteStaff: (data, callback) => {
        // Generate unique token
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        staffRepo.createInvitation(
            {
                email: data.email,
                token,
                store_id: data.store_id,
                is_admin: data.is_admin || false,
                is_manager: data.is_manager || false,
                expires_at: expiresAt
            },
            (err, result) => {
                if (err) {
                    console.error('Invitation error:', err);
                    return callback(new Error('Failed to invite staff'));
                }

                // TODO: integrate email service here
                // Example invite link: `/staff/onboard/${token}`
                console.log(`Invite link for ${data.email}: http://localhost:3000/staff/onboard/${token}`);

                callback(null, result);
            }
        );
    },

    onboardStaff: (token, staffData, callback) => {
        staffRepo.findInvitationByToken(token, (err, invite) => {
            if (err || !invite) {
                return callback(new Error('Invalid or expired invitation'));
            }
            // Hash chosen password
            bcrypt.hash(staffData.password, 10, (err, hashedPw) => {
                if (err) {
                    console.error('Hash error:', err);
                    return callback(new Error('Password hash failed'));
                }
                // Create staff account
                staffRepo.create(
                    {
                        first_name: staffData.first_name,
                        last_name: staffData.last_name,
                        email: invite.email,
                        store_id: invite.store_id,
                        password: hashedPw,
                        is_admin: invite.is_admin
                    },
                    (err, staff) => {
                        if (err) return callback(new Error('Failed to onboard staff'));

                        // Mark invitation as accepted
                        staffRepo.markInvitationAccepted(token, () => { });

                        callback(null, staff);
                    }
                );
            });
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