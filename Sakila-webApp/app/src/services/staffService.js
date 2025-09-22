const staffRepo = require('../repositories/staffRepository');
const countryRepo = require('../repositories/countryRepository');
const cityRepo = require('../repositories/cityRepository');
const addressRepo = require('../repositories/addressRepository');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendMail } = require('./emailService');

module.exports = {
    inviteStaff: (data, req, callback) => {
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        staffRepo.createInvitation({
            email: data.email,
            token,
            store_id: data.store_id,
            is_admin: data.is_admin || false,
            expires_at: expiresAt
        }, (err, result) => {
            if (err) return callback(err);

            const siteUrl = req.protocol + '://' + req.get('host');
            const inviteLink = `${siteUrl}/staff/onboard/${token}`;

            sendMail({
                to: data.email,
                subject: 'Staff Invitation',
                html: `
      <p>Hello ${data.first_name || ''},</p>
      <p>You have been invited to join Sakila as a staff member.</p>
      <p>Click the link to complete onboarding:</p>
      <a href="${inviteLink}">${inviteLink}</a>
      <p>This link expires in 30 days.</p>
    `
            }, (mailErr, info) => {
                if (mailErr) {
                    console.error('Email sending failed:', mailErr);
                    return callback(new Error(`Mail send failed: ${mailErr.message}`));
                }

                console.log(`Invite email sent to ${data.email}: ${info?.messageId}`);
                return callback(null, result);
            });
 
        })
    },
    onboardStaff: (token, staffData, callback) => {
        staffRepo.findInvitationByToken(token, (err, invite) => {
            if (err) return callback(err);
            if (!invite) return callback(new Error('Invalid or expired invitation'));

            // Find or create country
            countryRepo.findByName(staffData.country, (err, country) => {
                if (err || !country) return callback(err || new Error(`Country not found: ${staffData.country}`));

                // Find or create city
                cityRepo.create({ city: staffData.city, country_id: country.id }, (err, city) => {
                    if (err || !city) return callback(err || new Error('City not found or created'));

                    // Find or create address
                    addressRepo.create(
                        {
                            address: staffData.address,
                            district: staffData.district,
                            postal_code: staffData.postal_code,
                            phone: staffData.phone,
                            city_id: city.id
                        },
                        (err, address) => {
                            if (err || !address) return callback(err || new Error('Address not created'));

                            // Hash password
                            bcrypt.hash(staffData.password, 10, (err, hashedPw) => {
                                if (err) return callback(err);

                                // Create staff with address_id
                                staffRepo.create(
                                    {
                                        first_name: staffData.first_name,
                                        last_name: staffData.last_name,
                                        username: staffData.username,
                                        email: invite.email,
                                        store_id: invite.store_id,
                                        password: hashedPw,
                                        is_admin: invite.is_admin,
                                        address_id: address.id,
                                        active: true
                                    },
                                    (err, staff) => {
                                        if (err) return callback(err);

                                        // Mark invitation accepted
                                        staffRepo.markInvitationAccepted(token, () => { });

                                        callback(null, staff);
                                    }
                                );
                            });
                        }
                    );
                });
            });
        });
    },

    removeStaff: (staffId, callback) => {
        staffRepo.deleteStaffMember(staffId, callback);
    },

    loginStaff: (data, callback) => {
        staffRepo.findByEmailWithRole(data.email, (err, staff) => {
            if (err) return callback(err);
            if (!staff) return callback(null, null);

            bcrypt.compare(data.password, staff.password, (err, match) => {
                if (err) return callback(err);
                if (!match) return callback(new Error('Invalid password'));

                return callback(null, staff);
            });
        });
    }
};
