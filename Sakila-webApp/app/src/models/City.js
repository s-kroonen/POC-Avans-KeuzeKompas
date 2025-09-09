class City {
  constructor({ city_id, city, country_id }) {
    this.id = city_id;
    this.city = city;
    this.country_id = country_id;
  }

  static fromRow(row) {
    return row ? new City(row) : null;
  }

  static fromRows(rows) {
    return rows.map(r => new City(r));
  }
}

module.exports = City;
