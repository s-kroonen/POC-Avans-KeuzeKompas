class Film {
  constructor({
    film_id,
    title,
    description,
    release_year,
    language_id,
    rental_duration,
    rental_rate,
    length,
    replacement_cost,
    rating,
    language_name
  }) {
    this.id = film_id;
    this.title = title;
    this.description = description;
    this.release_year = release_year;
    this.language_id = language_id;
    this.rental_duration = rental_duration;
    this.rental_rate = rental_rate;
    this.length = length;
    this.replacement_cost = replacement_cost;
    this.rating = rating;
    this.language_name = language_name;
  }

  static fromRow(row) {
    return row ? new Film(row) : null;
  }

  static fromRows(rows) {
    return rows.map(r => new Film(r));
  }
}

module.exports = Film;
