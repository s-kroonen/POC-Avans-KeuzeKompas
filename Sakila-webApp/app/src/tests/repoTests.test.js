jest.mock('../db/mysql', () => ({
  query: jest.fn()
}));

const db = require('../db/mysql');

// Import repositories
const StaffRepository = require('../repositories/staffRepository');
const CustomerRepository = require('../repositories/userRepository');
const StoreRepository = require('../repositories/storeRepository');
const CityRepository = require('../repositories/cityRepository');
const CountryRepository = require('../repositories/countryRepository');
const FilmRepository = require('../repositories/filmRepository');
const AddressRepository = require('../repositories/addressRepository');

// Import models
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');
const Store = require('../models/Store');
const City = require('../models/City');
const Country = require('../models/Country');
const Film = require('../models/Film');
const Address = require('../models/Address');

beforeEach(() => {
  db.query.mockReset();
});

//
// STAFF REPO
//
describe('StaffRepository', () => {
  test('findByEmail returns Staff instance', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, [{ staff_id: 1, email: 's@test.com' }]));
    StaffRepository.findByEmail('s@test.com', (err, staff) => {
      expect(err).toBeNull();
      expect(staff).toBeInstanceOf(Staff);
      expect(staff.id).toBe(1);
      done();
    });
  });

  test('findByEmailWithRole assigns admin role', done => {
    db.query.mockImplementationOnce((sql, params, cb) =>
      cb(null, [{ staff_id: 2, email: 'admin@test.com', is_admin: 1 }])
    );
    StaffRepository.findByEmailWithRole('admin@test.com', (err, staff) => {
      expect(err).toBeNull();
      expect(staff.role).toBe('admin');
      done();
    });
  });

  test('findByEmailWithRole assigns manager role', done => {
    // First query returns staff
    db.query
      .mockImplementationOnce((sql, params, cb) =>
        cb(null, [{ staff_id: 3, email: 'manager@test.com', is_admin: 0 }])
      )
      // Second query checks store manager
      .mockImplementationOnce((sql, params, cb) => cb(null, [{ store_id: 1 }]));

    StaffRepository.findByEmailWithRole('manager@test.com', (err, staff) => {
      expect(err).toBeNull();
      expect(staff.role).toBe('manager');
      done();
    });
  });
});

//
// CUSTOMER REPO
//
describe('CustomerRepository', () => {
  test('findByEmail returns Customer instance', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, [{ customer_id: 1, email: 'c@test.com' }]));
    CustomerRepository.findByEmail('c@test.com', (err, customer) => {
      expect(err).toBeNull();
      expect(customer).toBeInstanceOf(Customer);
      expect(customer.id).toBe(1);
      done();
    });
  });
});

//
// STORE REPO
//
describe('StoreRepository', () => {
  test('getAll returns Store instances', done => {
    db.query.mockImplementation((sql, cb) => cb(null, [{ store_id: 1 }]));
    StoreRepository.getAll((err, stores) => {
      expect(err).toBeNull();
      expect(stores[0]).toBeInstanceOf(Store);
      expect(stores[0].id).toBe(1);
      done();
    });
  });

  test('isManager true when staff manages a store', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, [{ store_id: 10 }]));
    StoreRepository.isManager(5, (err, result) => {
      expect(err).toBeNull();
      expect(result).toBe(true);
      done();
    });
  });

  test('isManager false when staff not a manager', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, []));
    StoreRepository.isManager(5, (err, result) => {
      expect(err).toBeNull();
      expect(result).toBe(false);
      done();
    });
  });
});

//
// CITY REPO
//
describe('CityRepository', () => {
  test('create inserts city', done => {
    // First query: INSERT
    db.query
      .mockImplementationOnce((sql, params, cb) => cb(null, { insertId: 2 }))
      // Second query: SELECT after insert
      .mockImplementationOnce((sql, params, cb) => cb(null, [{ city_id: 2, city: 'TestCity', country_id: 1 }]));

    CityRepository.create({ city: 'TestCity', country_id: 1 }, (err, city) => {
      expect(err).toBeNull();
      expect(city).toBeInstanceOf(City);
      expect(city.id).toBe(2);
      expect(city.city).toBe('TestCity');
      done();
    });
  });

});

//
// COUNTRY REPO
//
describe('CountryRepository', () => {
  test('findByName returns Country instance', done => {
    db.query.mockImplementation((sql, params, cb) =>
      cb(null, [{ country_id: 4, country: 'Netherlands' }])
    );

    CountryRepository.findByName('Netherlands', (err, country) => {
      expect(err).toBeNull();
      expect(country).toBeInstanceOf(Country);
      expect(country.country).toBe('Netherlands');
      expect(country.id).toBe(4);
      done();
    });
  });

});

//
// FILM REPO
//
describe('FilmRepository', () => {
  test('listFilms returns Film instances', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, [{ film_id: 1, title: 'Movie' }]));
    FilmRepository.list(10, 0, (err, films) => {
      expect(err).toBeNull();
      expect(films[0]).toBeInstanceOf(Film);
      done();
    });
  });

  test('countFilms returns count', done => {
    db.query.mockImplementation((sql, cb) => cb(null, [{ cnt: 42 }]));
    FilmRepository.count((err, count) => {
      expect(err).toBeNull();
      expect(count).toBe(42);
      done();
    });
  });

  test('getFilmById returns Film instance', done => {
    db.query.mockImplementation((sql, params, cb) => cb(null, [{ film_id: 2, title: 'Other Movie' }]));
    FilmRepository.findById(2, (err, film) => {
      expect(err).toBeNull();
      expect(film).toBeInstanceOf(Film);
      expect(film.id).toBe(2);
      done();
    });
  });
});

//
// ADDRESS REPO
//
describe('AddressRepository', () => {
  test('findOrCreate finds address', done => {
    db.query.mockImplementationOnce((sql, params, cb) => cb(null, [{ address_id: 5 }]));
    AddressRepository.findOrCreate({ address: 'Main St', district: 'District' }, 1, (err, result) => {
      expect(err).toBeNull();
      expect(result.address_id).toBe(5);
      done();
    });
  });

  test('findOrCreate creates address if not found', done => {
    db.query
      .mockImplementationOnce((sql, params, cb) => cb(null, [])) // Not found
      .mockImplementationOnce((sql, params, cb) => cb(null, { insertId: 6 })); // Insert
    AddressRepository.findOrCreate({ address: 'New St', district: 'District' }, 1, (err, result) => {
      expect(err).toBeNull();
      expect(result.address_id).toBe(6);
      done();
    });
  });
});
