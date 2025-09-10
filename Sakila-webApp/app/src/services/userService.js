const countryRepo = require('../repositories/countryRepository');
const cityRepo = require('../repositories/cityRepository');
const addressRepo = require('../repositories/addressRepository');
const userRepo = require('../repositories/userRepository');
const staffRepo = require('../repositories/staffRepository');
const bcrypt = require('bcryptjs');

module.exports.inviteStaff = (data, callback) => {
    const { email, first_name, last_name, store_id } = data;

    // Check if the staff member already exists
    staffRepo.findByEmail(email, (err, existingStaff) => {
        if (err) {
            console.error('Error checking existing staff:', err);
            return callback(new Error('Error checking existing staff'));
        }
        if (existingStaff) {
            return callback(new Error('Staff member already exists'));
        }

        // Create a temporary password for the invited staff
        const tempPassword = Math.random().toString(36).slice(-8); // Generate a random password

        // Hash the temporary password
        bcrypt.hash(tempPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return callback(new Error('Error creating staff member'));
            }

            // Create the staff member in the database
            staffRepo.createStaff({
                email,
                first_name,
                last_name,
                store_id,
                password: hashedPassword,
                is_admin: false // Default to false for staff
            }, (err, result) => {
                if (err) {
                    console.error('Error creating staff member:', err);
                    return callback(new Error('Error creating staff member'));
                }

                // Send invitation email (pseudo-code)
                // sendInvitationEmail(email, tempPassword);

                callback(null, result);
            });
        });
    });
};

module.exports.onboardStaff = (data, callback) => {
    const { email, password } = data;

    // Find the staff member by email
    staffRepo.findByEmail(email, (err, staff) => {
        if (err || !staff) {
            console.error('Staff member not found:', err);
            return callback(new Error('Staff member not found'));
        }

        // Update the staff member's password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return callback(new Error('Error updating password'));
            }

            staffRepo.updatePassword(staff.id, hashedPassword, (err) => {
                if (err) {
                    console.error('Error updating password:', err);
                    return callback(new Error('Error updating password'));
                }

                callback(null, { message: 'Staff member onboarded successfully' });
            });
        });
    });
};

module.exports.onboardAdmin = (data, callback) => {
    const { email, first_name, last_name, password } = data;

    // Check if the admin already exists
    userRepo.findByEmail(email, (err, existingAdmin) => {
        if (err) {
            console.error('Error checking existing admin:', err);
            return callback(new Error('Error checking existing admin'));
        }
        if (existingAdmin) {
            return callback(new Error('Admin already exists'));
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return callback(new Error('Error creating admin'));
            }

            // Create the admin in the database
            userRepo.createAdmin({
                email,
                first_name,
                last_name,
                password: hashedPassword,
                is_admin: true // Set is_admin to true
            }, (err, result) => {
                if (err) {
                    console.error('Error creating admin:', err);
                    return callback(new Error('Error creating admin'));
                }

                callback(null, result);
            });
        });
    });
};


module.exports.registerCustomer = (data, callback) => {
    try {
        // Find country
        countryRepo.findByName(data.country, (err, country) => {
            if (err || !country) {
                console.error('Country error:', err);
                return callback(new Error('Country not found'));
            }
            // Find or create city
            cityRepo.create({city: data.city, country_id: country.country_id}, (err, city) => {
                if (err || !city) {
                    console.error('City error:', err);
                    return callback(new Error('City not found or created'));
                }
                // Create address
                addressRepo.findOrCreate(
                    {
                        address: data.address,
                        district: data.district,
                        postal_code: data.postal_code,
                        phone: data.phone,
                        city_id: city.city_id
                    },
                    (err, address) => {
                        if (err || !address) {
                            console.error('Address error:', err);
                            return callback(new Error('Address not created'));
                        }
                        // Hash password
                        bcrypt.hash(data.password, 10, (err, hashed) => {
                            if (err) {
                                console.error('Hash error:', err);
                                return callback(new Error('Password hash failed'));
                            }
                            // Create customer
                            userRepo.create({
                                store_id: data.store_id,
                                email: data.email,
                                password: hashed,
                                first_name: data.first_name,
                                last_name: data.last_name,
                                address_id: address.address_id
                            },
                                (err, result) => {
                                    if (err) {
                                        console.error('Customer error:', err);
                                        return callback(new Error('Customer not created'));
                                    }
                                    callback(null, result);
                                }
                            );
                        });
                    }
                );
            });
        });
    } catch (err) {
        console.error('Register error:', err);
        callback(err);
    }
};

