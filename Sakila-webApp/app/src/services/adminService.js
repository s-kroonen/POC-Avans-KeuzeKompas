const StoreRepository = require('../repositories/storeRepository');
const StaffRepository = require('../repositories/staffRepository');

class AdminService {
  // -------- STORES --------
  static getStores(cb) {
    StoreRepository.getAll(cb);
  }

  static addStore(storeData, cb) {
    // validate required fields
    if (!storeData.managerStaffId || !storeData.addressId) {
      return cb(new Error("Manager staff ID and address ID are required."));
    }

    // check that manager staff exists
    StaffRepository.findById(storeData.managerStaffId, (err, staff) => {
      if (err) return cb(err);
      if (!staff) return cb(new Error("Manager staff does not exist."));

      // TODO: optionally check address exists if you have an AddressRepository
      StoreRepository.create(storeData, cb);
    });
  }

  static updateStore(storeId, storeData, cb) {
    StaffRepository.findById(storeData.managerStaffId, (err, staff) => {
      if (err) return cb(err);
      if (!staff) return cb(new Error("Manager staff does not exist."));

      StoreRepository.update(storeId, storeData, cb);
    });
  }

  static removeStore(storeId, cb) {
    // soft delete = set active=0
    StoreRepository.update(storeId, { managerStaffId: null, addressId: null, active: 0 }, (err, store) => {
      if (err) return cb(err);
      cb(null, store);
    });
  }

  // -------- STAFF --------
  static getStaff(cb) {
    StaffRepository.findAll(cb);
  }

  static addStaff(staffData, cb) {
    if (!staffData.email) return cb(new Error("Email is required"));

    StaffRepository.findByEmail(staffData.email, (err, existing) => {
      if (err) return cb(err);
      if (existing) return cb(new Error("Email already in use"));

      // validate store exists if store_id provided
      if (staffData.store_id) {
        StoreRepository.getById(staffData.store_id, (err, store) => {
          if (err) return cb(err);
          if (!store) return cb(new Error("Store does not exist"));

          StaffRepository.create(staffData, cb);
        });
      } else {
        StaffRepository.create(staffData, cb);
      }
    });
  }

  static updateStaff(id, updateData, cb) {
    if (updateData.email) {
      StaffRepository.findByEmail(updateData.email, (err, existing) => {
        if (err) return cb(err);
        if (existing && existing.id !== id) {
          return cb(new Error("Email already in use by another staff member"));
        }

        StaffRepository.update(id, updateData, cb);
      });
    } else {
      StaffRepository.update(id, updateData, cb);
    }
  }

  static removeStaff(id, cb) {
    // soft delete = set active=0
    StaffRepository.update(id, { is_admin: 0, active: 0 }, (err, staff) => {
      if (err) return cb(err);
      cb(null, staff);
    });
  }
}

module.exports = AdminService;
