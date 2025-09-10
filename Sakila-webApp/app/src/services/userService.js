const countryRepo = require('../repositories/countryRepository');
const cityRepo = require('../repositories/cityRepository');
const addressRepo = require('../repositories/addressRepository');
const CustomerRepo = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');



module.exports = {
    loginCustomer: (data, callback) => {
        CustomerRepo.findByEmail(data.email, (err, customer) => {
            if (err) return callback(new Error('Database error'));
            if (!customer) return callback(new Error( 'No user found with that email' ));

            bcrypt.compare(data.password, customer.password, (err, match) => {
                if (err || !match) {
                    console.error('Customer error:', err);
                    return callback(new Error('Invalid password'));
                };
                customer.role = 'customer';
                callback(null, customer);
            });
        });
    },
    registerCustomer: (data, callback) => {
        try {
            // Find country
            countryRepo.findByName(data.country, (err, country) => {
                if (err || !country) {
                    console.error('Country error:', err);
                    return callback(new Error('Country not found'));
                }
                // Find or create city
                cityRepo.create({ city: data.city, country_id: country.country_id }, (err, city) => {
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
                                CustomerRepo.create({
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
    }


}