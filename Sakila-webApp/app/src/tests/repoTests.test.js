jest.mock('../db/mysql', () => ({
  query: jest.fn()
}));

const db = require('../db/mysql');
const userRepo = require('../repositories/userRepository');
const storeRepo = require('../repositories/storeRepository');
const cityRepo = require('../repositories/cityRepository');
const countryRepo = require('../repositories/countryRepository');
const filmRepo = require('../repositories/filmRepository');
const addressRepo = require('../repositories/addressRepository');

describe('userRepository', () => {
  beforeEach(() => db.query.mockReset());

  test('findByEmail returns user', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, [{ email: 'test@example.com' }]));
    userRepo.findByEmail('test@example.com', (err, results) => {
      expect(err).toBeNull();
      expect(results[0].email).toBe('test@example.com');
      done();
    });
  });

  test('createCustomer inserts user', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, { insertId: 1 }));
    userRepo.createCustomer({
      store_id: 1,
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      address_id: 1,
      password: 'hashed'
    }, (err, result) => {
      expect(err).toBeNull();
      expect(result.insertId).toBe(1);
      done();
    });
  });
});

describe('storeRepository', () => {
  beforeEach(() => db.query.mockReset());

  test('getAll returns stores', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, [{ store_id: 1 }]));
    storeRepo.getAll((err, results) => {
      expect(err).toBeNull();
      expect(results[0].store_id).toBe(1);
      done();
    });
  });
});

describe('cityRepository', () => {
  beforeEach(() => db.query.mockReset());

  test('findOrCreate finds city', done => {
    db.query.mockImplementationOnce((sql, params, cb) => cb(null, [{ city_id: 2 }]));
    cityRepo.findOrCreate('testcity', 1, (err, city) => {
      expect(err).toBeNull();
      expect(city.city_id).toBe(2);
      done();
    });
  });

  test('findOrCreate creates city if not found', done => {
    db.query
      .mockImplementationOnce((sql, params, cb) => cb(null, []))
      .mockImplementationOnce((sql, params, cb) => cb(null, { insertId: 3 }));
    cityRepo.findOrCreate('newcity', 1, (err, city) => {
      expect(err).toBeNull();
      expect(city.city_id).toBe(3);
      done();
    });
  });
});

describe('countryRepository', () => {
  beforeEach(() => db.query.mockReset());

  test('findByName returns country', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, [{ country_id: 4 }]));
    countryRepo.findByName('Netherlands', (err, country) => {
      expect(err).toBeNull();
      expect(country.country_id).toBe(4);
      done();
    });
  });

  test('getAll returns countries', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, [{ country: 'Netherlands' }]));
    countryRepo.getAll((err, countries) => {
      expect(err).toBeNull();
      expect(countries[0].country).toBe('Netherlands');
      done();
    });
  });
});

describe('filmRepository', () => {
  beforeEach(() => db.query.mockReset());

  test('listFilms returns films', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, [{ film_id: 1 }]));
    filmRepo.listFilms(10, 0, (err, films) => {
      expect(err).toBeNull();
      expect(films[0].film_id).toBe(1);
      done();
    });
  });

  test('countFilms returns count', done => {
    db.query.mockImplementation((sql, cb) => cb(null, [{ cnt: 42 }]));
    filmRepo.countFilms((err, count) => {
      expect(err).toBeNull();
      expect(count).toBe(42);
      done();
    });
  });

  test('getFilmById returns film', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, [{ film_id: 2 }]));
    filmRepo.getFilmById(2, (err, film) => {
      expect(err).toBeNull();
      expect(film.film_id).toBe(2);
      done();
    });
  });
});

describe('addressRepository', () => {
  beforeEach(() => db.query.mockReset());

  test('findOrCreate finds address', done => {
    db.query.mockImplementationOnce((sql, params, cb) => cb(null, [{ address_id: 5 }]));
    addressRepo.findOrCreate({ address: 'Main St', district: 'District', postal_code: '12345', phone: '555-1234' }, 1, (err, address) => {
      expect(err).toBeNull();
      expect(address.address_id).toBe(5);
      done();
    });
  });

  test('findOrCreate creates address if not found', done => {
    db.query
      .mockImplementationOnce((sql, params, cb) => cb(null, []))
      .mockImplementationOnce((sql, params, cb) => cb(null, { insertId: 6 }));
    addressRepo.findOrCreate({ address: 'New St', district: 'District', postal_code: '12345', phone: '555-1234' }, 1, (err, address) => {
      expect(err).toBeNull();
      expect(address.address_id).toBe(6);
      done();
    });
  });
});