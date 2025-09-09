class Address {
  constructor({
    address_id,
    address,
    address2,
    district,
    city_id,
    postal_code,
    phone
  }) {
    this.id = address_id;
    this.address = address;
    this.address2 = address2;
    this.district = district;
    this.city_id = city_id;
    this.postal_code = postal_code;
    this.phone = phone;
  }

  static fromRow(row) {
    return row ? new Address(row) : null;
  }

  static fromRows(rows) {
    return rows.map(r => new Address(r));
  }
}

module.exports = Address;
