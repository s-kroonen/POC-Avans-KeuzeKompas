jest.mock('../repositories/countryRepository', () => ({
  findByName: jest.fn()
}));
jest.mock('../repositories/cityRepository', () => ({
  findOrCreate: jest.fn()
}));
jest.mock('../repositories/addressRepository', () => ({
  findOrCreate: jest.fn()
}));
jest.mock('../repositories/userRepository', () => ({
  createCustomer: jest.fn()
}));
jest.mock('bcryptjs', () => ({
  hash: jest.fn()
}));

const countryRepo = require('../repositories/countryRepository');
const cityRepo = require('../repositories/cityRepository');
const addressRepo = require('../repositories/addressRepository');
const userRepo = require('../repositories/userRepository');
const bcrypt = require('bcryptjs');
const userService = require('../services/userService');

const filmRepo = require('../repositories/filmRepository');
jest.mock('../repositories/filmRepository', () => ({
  countFilms: jest.fn(),
  listFilms: jest.fn(),
  getFilmById: jest.fn()
}));
const filmService = require('../services/filmService');

describe('userService.registerCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should register customer successfully', done => {
    countryRepo.findByName.mockImplementation((country, cb) => cb(null, { country_id: 1 }));
    cityRepo.findOrCreate.mockImplementation((city, country_id, cb) => cb(null, { city_id: 2 }));
    addressRepo.findOrCreate.mockImplementation((address, city_id, cb) => cb(null, { address_id: 3 }));
    bcrypt.hash.mockImplementation((pw, salt, cb) => cb(null, 'hashedpw'));
    userRepo.createCustomer.mockImplementation((customer, cb) => cb(null, { insertId: 4 }));

    const mockData = {
      country: 'Netherlands',
      city: 'amsterdam',
      address: 'Main St',
      district: 'Noord',
      postal_code: '12345',
      phone: '555-1234',
      store_id: 1,
      email: 'test@example.com',
      password: 'password',
      first_name: 'Test',
      last_name: 'User'
    };

    userService.registerCustomer(mockData, (err, result) => {
      expect(err).toBeNull();
      expect(result.insertId).toBe(4);
      expect(countryRepo.findByName).toHaveBeenCalledWith('Netherlands', expect.any(Function));
      expect(cityRepo.findOrCreate).toHaveBeenCalledWith('amsterdam', 1, expect.any(Function));
      expect(addressRepo.findOrCreate).toHaveBeenCalledWith(
        { address: 'Main St', district: 'Noord', postal_code: '12345', phone: '555-1234' },
        2,
        expect.any(Function)
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10, expect.any(Function));
      expect(userRepo.createCustomer).toHaveBeenCalledWith(
        expect.objectContaining({
          store_id: 1,
          email: 'test@example.com',
          password: 'hashedpw',
          first_name: 'Test',
          last_name: 'User',
          address_id: 3
        }),
        expect.any(Function)
      );
      done();
    });
  });

  test('should fail if country not found', done => {
    countryRepo.findByName.mockImplementation((country, cb) => cb(null, null));
    userService.registerCustomer({ country: 'Nowhere' }, (err, result) => {
      expect(err).toBeTruthy();
      expect(err.message).toBe('Country not found');
      expect(result).toBeUndefined();
      done();
    });
  });

  test('should fail if city not found', done => {
    countryRepo.findByName.mockImplementation((country, cb) => cb(null, { country_id: 1 }));
    cityRepo.findOrCreate.mockImplementation((city, country_id, cb) => cb(null, null));
    userService.registerCustomer({ country: 'Netherlands', city: 'failcity' }, (err, result) => {
      expect(err).toBeTruthy();
      expect(err.message).toBe('City not found or created');
      expect(result).toBeUndefined();
      done();
    });
  });

  test('should fail if address not created', done => {
    countryRepo.findByName.mockImplementation((country, cb) => cb(null, { country_id: 1 }));
    cityRepo.findOrCreate.mockImplementation((city, country_id, cb) => cb(null, { city_id: 2 }));
    addressRepo.findOrCreate.mockImplementation((address, city_id, cb) => cb(null, null));
    userService.registerCustomer({ country: 'Netherlands', city: 'amsterdam', address: 'failaddress' }, (err, result) => {
      expect(err).toBeTruthy();
      expect(err.message).toBe('Address not created');
      expect(result).toBeUndefined();
      done();
    });
  });

  test('should fail if password hash fails', done => {
    countryRepo.findByName.mockImplementation((country, cb) => cb(null, { country_id: 1 }));
    cityRepo.findOrCreate.mockImplementation((city, country_id, cb) => cb(null, { city_id: 2 }));
    addressRepo.findOrCreate.mockImplementation((address, city_id, cb) => cb(null, { address_id: 3 }));
    bcrypt.hash.mockImplementation((pw, salt, cb) => cb(new Error('Hash error')));
    userService.registerCustomer({ country: 'Netherlands', city: 'amsterdam', address: 'Main St', password: 'pw' }, (err, result) => {
      expect(err).toBeTruthy();
      expect(err.message).toBe('Password hash failed');
      expect(result).toBeUndefined();
      done();
    });
  });

  test('should fail if customer not created', done => {
    countryRepo.findByName.mockImplementation((country, cb) => cb(null, { country_id: 1 }));
    cityRepo.findOrCreate.mockImplementation((city, country_id, cb) => cb(null, { city_id: 2 }));
    addressRepo.findOrCreate.mockImplementation((address, city_id, cb) => cb(null, { address_id: 3 }));
    bcrypt.hash.mockImplementation((pw, salt, cb) => cb(null, 'hashedpw'));
    userRepo.createCustomer.mockImplementation((customer, cb) => cb(new Error('Customer error')));
    userService.registerCustomer({ country: 'Netherlands', city: 'amsterdam', address: 'Main St', password: 'pw' }, (err, result) => {
      expect(err).toBeTruthy();
      expect(err.message).toBe('Customer not created');
      expect(result).toBeUndefined();
      done();
    });
  });
});

describe('filmService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getPagedFilms returns paged films', done => {
    filmRepo.countFilms.mockImplementation(cb => cb(null, 20));
    filmRepo.listFilms.mockImplementation((limit, offset, cb) => cb(null, [{ film_id: 1 }, { film_id: 2 }]));
    filmService.getPagedFilms(1, 10, (err, result) => {
      expect(err).toBeNull();
      expect(result.rows.length).toBe(2);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(10);
      expect(result.total).toBe(20);
      expect(result.totalPages).toBe(2);
      done();
    });
  });

  test('getPagedFilms returns error if count fails', done => {
    filmRepo.countFilms.mockImplementation(cb => cb(new Error('Count error')));
    filmService.getPagedFilms(1, 10, (err, result) => {
      expect(err).toBeTruthy();
      expect(result).toBeUndefined();
      done();
    });
  });

  test('getPagedFilms returns error if list fails', done => {
    filmRepo.countFilms.mockImplementation(cb => cb(null, 20));
    filmRepo.listFilms.mockImplementation((limit, offset, cb) => cb(new Error('List error')));
    filmService.getPagedFilms(1, 10, (err, result) => {
      expect(err).toBeTruthy();
      expect(result).toBeUndefined();
      done();
    });
  });

  test('getFilmDetails returns film details', done => {
    filmRepo.getFilmById.mockImplementation((id, cb) => cb(null, { film_id: id, title: 'Test Film' }));
    filmService.getFilmDetails(1, (err, film) => {
      expect(err).toBeNull();
      expect(film.film_id).toBe(1);
      expect(film.title).toBe('Test Film');
      done();
    });
  });

  test('getFilmDetails returns error if not found', done => {
    filmRepo.getFilmById.mockImplementation((id, cb) => cb(new Error('Not found')));
    filmService.getFilmDetails(1, (err, film) => {
      expect(err).toBeTruthy();
      expect(film).toBeUndefined();
      done();
    });
  });
});