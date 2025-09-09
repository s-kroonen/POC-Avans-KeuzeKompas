class Country {
  constructor({ country_id, country }) {
    this.id = country_id;
    this.country = country;
  }

  static fromRow(row) {
    return row ? new Country(row) : null;
  }

  static fromRows(rows) {
    return rows.map(r => new Country(r));
  }
}

module.exports = Country;
