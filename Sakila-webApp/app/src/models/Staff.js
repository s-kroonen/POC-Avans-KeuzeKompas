class Staff {
  constructor({ staff_id, store_id, first_name, last_name, email, address_id, username, password, is_admin , active}) {
    this.id = staff_id;
    this.store_id = store_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.address_id = address_id;
    this.username = username;
    this.password = password;
    this.is_admin = !!is_admin;
    this.is_active = !!active; 
  }
  static fromRow(row) {
    return row ? new Staff(row) : null;
  }

  static fromRows(rows) {
    return rows.map(r => new Staff(r));
  }
}

module.exports = Staff;