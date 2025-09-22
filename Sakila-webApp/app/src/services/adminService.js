const StaffRepo = require('../repositories/staffRepository');
const StoreRepo = require('../repositories/storeRepository');
const AddressRepo = require('../repositories/addressRepository');
const CityRepo = require('../repositories/cityRepository');
const CountryRepo = require('../repositories/countryRepository');

module.exports = {
  // -------- STAFF --------
  getAllStaff: (cb) => {
    StaffRepo.findAll((err, staff) => {
      if (err) return cb(err);
      cb(null, staff);
    });
  },

  getStaffWithAddress: (id, cb) => {
    StaffRepo.findById(id, (err, staff) => {
      if (err || !staff) return cb(err || new Error("Staff not found"));

      AddressRepo.findById(staff.address_id, (aerr, address) => {
        if (aerr || !address) return cb(aerr || new Error("Address not found"));

        CityRepo.findById(address.city_id, (cerr, city) => {
          if (cerr || !city) return cb(cerr || new Error("City not found"));

          CountryRepo.findById(city.country_id, (kerr, country) => {
            if (kerr || !country) return cb(kerr || new Error("Country not found"));

            cb(null, {
              ...staff,
              address: address.address,
              district: address.district,
              postal_code: address.postal_code,
              phone: address.phone,
              city: city.city,
              country: country.country
            });
          });
        });
      });
    });
  },

  saveStaff: (data, cb) => {
    CountryRepo.findByName(data.country, (err, country) => {
      if (err || !country) return cb(new Error("Invalid country"));

      CityRepo.create({ city: data.city, country_id: country.id }, (cerr, city) => {
        if (cerr || !city) {
          console.log(cerr);

          return cb(new Error("City error"));
        }
        AddressRepo.findOrCreate({
          address: data.address,
          district: data.district,
          postal_code: data.postal_code,
          phone: data.phone,
          city_id: city.id
        }, (aerr, address) => {
          if (aerr || !address) return cb(new Error("Address error"));

          const staffData = {
            id: data.staff_id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            username: data.username,
            password: data.password,
            store_id: data.store_id,
            is_active: data.is_active ? 1 : 0,
            is_admin: data.is_admin ? 1 : 0,
            address_id: address.id
          };
          console.log("staffData: ", staffData);

          if (staffData.id) {
            StaffRepo.update(staffData.id, staffData, cb);
          } else {
            StaffRepo.create(staffData, cb);
          }
        });
      });
    });
  },

  removeStaff: (id, cb) => {
    StaffRepo.delete(id, cb);
  },

  // -------- STORES --------
  getAllStores: (cb) => {
    StoreRepo.getAll((err, stores) => {
      if (err) return cb(err);
      cb(null, stores);
    });
  },

  getStoreWithAddress: (id, cb) => {
    StoreRepo.getById(id, (err, store) => {
      if (err || !store) return cb(err || new Error("Store not found"));

      AddressRepo.findById(store.addressId, (aerr, address) => {
        if (aerr || !address) return cb(aerr || new Error("Address not found"));

        CityRepo.findById(address.city_id, (cerr, city) => {
          if (cerr || !city) return cb(cerr || new Error("City not found"));

          CountryRepo.findById(city.country_id, (kerr, country) => {
            if (kerr || !country) return cb(kerr || new Error("Country not found"));

            StaffRepo.findById(store.managerStaffId, (serr, manager) => {
              if (serr) return cb(serr || new Error("Manager not found"));

              cb(null, {
                ...store,
                managerName: manager ? `${manager.first_name} ${manager.last_name}` : null,
                address: address.address,
                district: address.district,
                postal_code: address.postal_code,
                phone: address.phone,
                city: city.city,
                country: country.country
              });
            });
          });
        });
      });
    });
  },


  saveStore: (data, cb) => {
    CountryRepo.findByName(data.country, (err, country) => {
      if (err || !country) return cb(new Error("Invalid country"));

      CityRepo.create({ city: data.city, country_id: country.id }, (cerr, city) => {
        if (cerr || !city) return cb(new Error("City error"));

        AddressRepo.findOrCreate({
          address: data.address,
          district: data.district,
          postal_code: data.postal_code,
          phone: data.phone,
          city_id: city.id
        }, (aerr, address) => {
          if (aerr || !address) return cb(new Error("Address error"));

          const storeData = {
            id: data.store_id,
            managerStaffId: data.manager_staff_id || null,
            addressId: address.id,
            is_active: data.is_active
          };
          console.log("storeData: ", storeData);
          console.log("data is_active: ", data.is_active);

          if (storeData.id) {
            StoreRepo.update(storeData.id, storeData, cb);
          } else {
            StoreRepo.create(storeData, cb);
          }
        });
      });
    });
  },

  removeStore: (id, cb) => {
    StoreRepo.delete(id, cb);
  }
};
