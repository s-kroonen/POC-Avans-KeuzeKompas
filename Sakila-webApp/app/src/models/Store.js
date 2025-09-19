class Store {
  constructor({ store_id, manager_staff_id, address_id, active }) {
    this.id = store_id;
    this.managerStaffId = manager_staff_id;
    this.addressId = address_id;
    this.is_active = active; 
  }

  static fromRow(row) {
    return row ? new Store(row) : null;
  }

  static fromRows(rows) {
    return rows.map(r => new Store(r));
  }
}

module.exports = Store;
