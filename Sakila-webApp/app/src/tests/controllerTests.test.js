jest.mock('../services/userService', () => ({
  registerCustomer: jest.fn()
}));
jest.mock('../repositories/countryRepository', () => ({
  getAll: jest.fn()
}));
jest.mock('../repositories/storeRepository', () => ({
  getAll: jest.fn()
}));
jest.mock('../repositories/userRepository', () => ({
  findByEmail: jest.fn(),
  getProfile: jest.fn()
}));
jest.mock('bcryptjs', () => ({
  compare: jest.fn()
}));
jest.mock('../services/filmService', () => ({
  getPagedFilms: jest.fn(),
  getFilmDetails: jest.fn()
}));
jest.mock('../repositories/staffRepository', () => ({
  findByEmailWithRole: jest.fn()
}));

const registerController = require('../controllers/registerController');
const profileController = require('../controllers/profileController');
const loginController = require('../controllers/loginController');
const homeController = require('../controllers/homeController');
const filmController = require('../controllers/filmController');

const userService = require('../services/userService');
const countryRepo = require('../repositories/countryRepository');
const storeRepo = require('../repositories/storeRepository');
const userRepo = require('../repositories/userRepository');
const staffRepo = require('../repositories/staffRepository');
const bcrypt = require('bcryptjs');
const filmService = require('../services/filmService');
const Customer = require('../models/Customer');
const Staff = require('../models/Staff');



describe('registerController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('showRegister renders with countries and stores', done => {
    countryRepo.getAll.mockImplementation(cb => cb(null, [{ country: 'Netherlands' }]));
    storeRepo.getAll.mockImplementation((cb) => cb(null, [{ store_id: 1 }]));
    const res = { render: jest.fn() };
    registerController.showRegister({}, res);
    setImmediate(() => {
      expect(res.render).toHaveBeenCalledWith('register', {
        countries: [{ country: 'Netherlands' }],
        stores: [{ store_id: 1 }]
      });
      done();
    });
  });

  test('showRegister handles country error', done => {
    countryRepo.getAll.mockImplementation(cb => cb(new Error('fail')));
    const res = { render: jest.fn() };
    registerController.showRegister({}, res);
    setImmediate(() => {
      expect(res.render).toHaveBeenCalledWith('register', {
        error: 'Could not load countries',
        countries: [],
        stores: []
      });
      done();
    });
  });

  test('showRegister handles store error', done => {
    countryRepo.getAll.mockImplementation(cb => cb(null, [{ country: 'Netherlands' }]));
    storeRepo.getAll.mockImplementation(cb => cb(new Error('fail')));
    const res = { render: jest.fn() };
    registerController.showRegister({}, res);
    setImmediate(() => {
      expect(res.render).toHaveBeenCalledWith('register', {
        error: 'Could not load stores',
        countries: [{ country: 'Netherlands' }],
        stores: []
      });
      done();
    });
  });

  test('register success redirects to login', done => {
    userService.registerCustomer.mockImplementation((data, cb) => cb(null, { insertId: 1 }));
    const req = { body: { email: 'test@example.com' } };
    const res = { redirect: jest.fn() };
    registerController.register(req, res);
    setImmediate(() => {
      expect(res.redirect).toHaveBeenCalledWith('/login');
      done();
    });
  });

  test('register failure renders error', done => {
    userService.registerCustomer.mockImplementation((data, cb) => cb(new Error('fail')));
    countryRepo.getAll.mockImplementation(cb => cb(null, [{ country: 'Netherlands' }]));
    const req = { body: { email: 'test@example.com' } };
    const res = { render: jest.fn() };
    registerController.register(req, res);
    setImmediate(() => {
      expect(res.render).toHaveBeenCalledWith('register', {
        error: 'fail',
        countries: [{ country: 'Netherlands' }]
      });
      done();
    });
  });
});

describe('profileController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('showProfile renders user profile', done => {
    userRepo.getProfile.mockImplementation((id, cb) => cb(null, [{ first_name: 'Test', last_name: 'User', email: 'test@example.com', store_id: 1, address: 'Main St', city: 'Amsterdam' }]));
    const req = { session: { user: { id: 1, role: 'customer' } } };
    const res = { render: jest.fn() };
    profileController.showProfile(req, res);
    setImmediate(() => {
      expect(res.render).toHaveBeenCalledWith('users/profile', {
        user: expect.objectContaining({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          store_id: 1,
          address: 'Main St',
          city: 'Amsterdam',
          role: 'customer'
        })
      });
      done();
    });
  });

  test('showProfile handles error', done => {
    userRepo.getProfile.mockImplementation((id, cb) => cb(new Error('fail')));
    const req = { session: { user: { id: 1, role: 'customer' } } };
    const res = { render: jest.fn() };

    profileController.showProfile(req, res);

    setImmediate(() => {
      expect(res.render).toHaveBeenCalledWith('users/profile', {
        error: 'Could not load profile',
        user: { id: 1, role: 'customer' }
      });
      done();
    });
  });

});

describe('loginController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('showLogin renders login', () => {
    const res = { render: jest.fn() };
    loginController.showLogin({}, res);
    expect(res.render).toHaveBeenCalledWith('login');
  });


  test('login success redirects for customer', done => {
    // No staff found
    staffRepo.findByEmailWithRole.mockImplementation((email, cb) => cb(null, null));

    // Customer found
    userRepo.findByEmail.mockImplementation((email, cb) =>
      cb(null, Customer.fromRow({
        customer_id: 1,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'hashedpw'
      }))
    );

    bcrypt.compare.mockImplementation((pw, hash, cb) => cb(null, true));

    const req = { body: { email: 'test@example.com', password: 'pw' }, session: {} };
    const res = { render: jest.fn(), redirect: jest.fn() };

    loginController.login(req, res);

    setImmediate(() => {
      expect(req.session.user).toEqual(
        expect.objectContaining({
          id: 1,
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          role: 'customer'
        })
      );
      expect(res.redirect).toHaveBeenCalledWith('/profile');
      done();
    });
  });

  test('login success redirects for staff', done => {
    // Staff found
    staffRepo.findByEmailWithRole.mockImplementation((email, cb) =>
      cb(null, Staff.fromRow({
        staff_id: 2,
        first_name: 'Staff',
        last_name: 'Member',
        email: 'staff@example.com',
        password: 'hashedpw',
        is_admin: false
      }))
    );

    bcrypt.compare.mockImplementation((pw, hash, cb) => cb(null, true));

    const req = { body: { email: 'staff@example.com', password: 'pw' }, session: {} };
    const res = { render: jest.fn(), redirect: jest.fn() };

    loginController.login(req, res);

    setImmediate(() => {
      expect(req.session.user).toBeInstanceOf(Staff);
      expect(req.session.user).toMatchObject({
        id: 2,
        first_name: 'Staff',
        last_name: 'Member',
        email: 'staff@example.com',
        is_admin: false
      });

      expect(res.redirect).toHaveBeenCalledWith('/profile');
      done();
    });
  });




  test('login handles db error', done => {
    staffRepo.findByEmailWithRole.mockImplementation((email, cb) => cb(null, null));
    userRepo.findByEmail.mockImplementation((email, cb) => cb(new Error('fail')));

    const req = { body: { email: 'test@example.com', password: 'pw' }, session: {} };
    const res = { render: jest.fn(), redirect: jest.fn() };

    loginController.login(req, res);

    setImmediate(() => {
      expect(res.render).toHaveBeenCalledWith('login', { error: 'Database error' });
      done();
    });
  });

  test('login handles no user found', done => {
    staffRepo.findByEmailWithRole.mockImplementation((email, cb) => cb(null, null));
    userRepo.findByEmail.mockImplementation((email, cb) => cb(null, null));

    const req = { body: { email: 'test@example.com', password: 'pw' }, session: {} };
    const res = { render: jest.fn(), redirect: jest.fn() };

    loginController.login(req, res);

    setImmediate(() => {
      expect(res.render).toHaveBeenCalledWith('login', { error: 'No user found with that email' });
      done();
    });
  });


  test('login handles invalid password', done => {
    userRepo.findByEmail.mockImplementation((email, cb) => cb(null, [{ customer_id: 1, first_name: 'Test', password: 'hashedpw', email: 'test@example.com' }]));
    bcrypt.compare.mockImplementation((pw, hash, cb) => cb(null, false));
    const req = { body: { email: 'test@example.com', password: 'wrongpw' }, session: {} };
    const res = { render: jest.fn() };
    loginController.login(req, res);
    setImmediate(() => {
      expect(res.render).toHaveBeenCalledWith('login', { error: 'Invalid password' });
      done();
    });
  });

  test('logout destroys session and redirects', done => {
    const req = { session: { destroy: jest.fn(cb => cb()) } };
    const res = { redirect: jest.fn() };
    loginController.logout(req, res);
    setImmediate(() => {
      expect(res.redirect).toHaveBeenCalledWith('/login');
      done();
    });
  });
});

describe('homeController', () => {
  test('getHome renders home page', () => {
    const req = {};
    const res = { render: jest.fn() };
    homeController.getHome(req, res);
    expect(res.render).toHaveBeenCalledWith('home/index', { title: 'Sakila – Home' });
  });
});

describe('filmController', () => {
  beforeEach(() => jest.clearAllMocks());

  test('list renders films list', done => {
    filmService.getPagedFilms.mockImplementation((page, pageSize, cb) => cb(null, {
      rows: [{ film_id: 1, title: 'Film 1' }],
      page: 1,
      pageSize: 20,
      totalPages: 1
    }));
    const req = { query: { page: '1', pageSize: '20' } };
    const res = { render: jest.fn() };
    filmController.list(req, res, () => { });
    setImmediate(() => {
      expect(res.render).toHaveBeenCalledWith('films/list', {
        title: 'Films',
        films: [{ film_id: 1, title: 'Film 1' }],
        page: 1,
        pageSize: 20,
        totalPages: 1
      });
      done();
    });
  });

  test('list handles error', done => {
    filmService.getPagedFilms.mockImplementation((page, pageSize, cb) => cb(new Error('fail')));
    const req = { query: { page: '1', pageSize: '20' } };
    const res = { render: jest.fn() };
    const next = jest.fn();
    filmController.list(req, res, next);
    setImmediate(() => {
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      done();
    });
  });

  test('detail renders film detail', done => {
    filmService.getFilmDetails.mockImplementation((id, cb) => cb(null, { film_id: 1, title: 'Film 1' }));
    const req = { params: { id: '1' } };
    const res = { render: jest.fn() };
    filmController.detail(req, res, () => { });
    setImmediate(() => {
      expect(res.render).toHaveBeenCalledWith('films/detail', { title: 'Film 1', film: { film_id: 1, title: 'Film 1' } });
      done();
    });
  });

  test('detail handles not found', done => {
    filmService.getFilmDetails.mockImplementation((id, cb) => cb(null, null));
    const req = { params: { id: '999' } };
    const res = { status: jest.fn(() => res), render: jest.fn() };
    filmController.detail(req, res, () => { });
    setImmediate(() => {
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.render).toHaveBeenCalledWith('layout', {
        title: 'Not Found',
        body: '<div class="container py-5"><h1>Film not found</h1></div>'
      });
      done();
    });
  });

  test('detail handles error', done => {
    filmService.getFilmDetails.mockImplementation((id, cb) => cb(new Error('fail')));
    const req = { params: { id: '1' } };
    const res = { render: jest.fn() };
    const next = jest.fn();
    filmController.detail(req, res, next);
    setImmediate(() => {
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      done();
    });
  });

  test('detail redirects if id is NaN', () => {
    const req = { params: { id: 'abc' } };
    const res = { redirect: jest.fn() };
    filmController.detail(req, res, () => { });
    expect(res.redirect).toHaveBeenCalledWith('/films');
  });
});