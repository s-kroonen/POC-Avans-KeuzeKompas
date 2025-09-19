const storeRepo = require('../repositories/storeRepository');
const staffRepo = require('../repositories/staffRepository');

module.exports = {
  // ----- STORES -----
  getAllStores: (cb) => storeRepo.getAll(cb),
  getStoreById: (id, cb) => storeRepo.getById (id, cb),
  saveStore: (data, cb) => {
    if (data.store_id) {
      storeRepo.update(data, cb);
    } else {
      storeRepo.create(data, cb);
    }
  },

  // ----- STAFF -----
  getAllStaff: (cb) => staffRepo.findAll(cb),
  getStaffById: (id, cb) => staffRepo.findById(id, cb),
  saveStaff: (data, cb) => {
    if (data.staff_id) {
      staffRepo.update(data, cb);
    } else {
      staffRepo.create(data, cb);
    }
  }
};
