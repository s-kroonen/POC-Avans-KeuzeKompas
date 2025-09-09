class Customer {
  constructor({ customer_id, store_id, first_name, last_name, email, address_id, password }) {
    this.id = customer_id;
    this.storeId = store_id;
    this.firstName = first_name;
    this.lastName = last_name;
    this.email = email;
    this.addressId = address_id;
    this.password = password;
  }

  static fromRow(row) {
    return row ? new Customer(row) : null;
  }

  static fromRows(rows) {
    return rows.map(r => new Customer(r));
  }
}

module.exports = Customer;
