/// <reference types="cypress" />

describe('Film CRUD (Staff Only)', () => {
  const staffUser = {
    username: 'admin@sakila.com',
    password: 'Admin123!'
  };
  const customerUser = {
    username: 'customer@sakila.com',
    password: 'Customer123!'
  };

  const testFilm = {
    title: 'Cypress Test Film',
    description: 'Film created by Cypress test suite.',
    releaseYear: 2025,
    language: 'English',
    rentalDuration: 7,
    rentalRate: 4.99,
    length: 120,
    replacementCost: 19.99,
    rating: 'PG'
  };

  beforeEach(() => {
    // Log in before each test
    cy.visit('/login');
    cy.get('input[name="email"]').type(staffUser.username);
    cy.get('input[name="password"]').type(staffUser.password);
    cy.get('form').submit();

    // Check login worked
    cy.url().should('not.include', '/login');
    cy.contains('Logout');
  });

  it('should create a new film', () => {
    cy.visit('/films/new');

    cy.get('input[name="title"]').type(testFilm.title);
    cy.get('textarea[name="description"]').type(testFilm.description);
    cy.get('input[name="release_year"]').type(testFilm.releaseYear);
    cy.get('select[name="language_id"]').select(testFilm.language);
    cy.get('input[name="rental_duration"]').type(testFilm.rentalDuration);
    cy.get('input[name="rental_rate"]').type(testFilm.rentalRate);
    cy.get('input[name="length"]').type(testFilm.length);
    cy.get('input[name="replacement_cost"]').type(testFilm.replacementCost);
    cy.get('select[name="rating"]').select(testFilm.rating);

    cy.get('form').submit();

    // Redirect goes to the film detail page
    cy.url().should('match', /\/films\/\d+$/);
    cy.contains(testFilm.title);
  });

  it('should view film detail via clickable title', () => {
    cy.visit('/films');

    // Click the card title to go to detail
    cy.contains(testFilm.title).click();

    cy.url().should('match', /\/films\/\d+$/);
    cy.contains(testFilm.description);
    cy.contains(`${testFilm.length} min`);
  });

  it('should edit an existing film from detail page', () => {
    cy.visit('/films');
    cy.contains(testFilm.title).click();
    cy.contains('Edit').click();

    cy.get('input[name="title"]').clear().type('Cypress Test Film Updated');
    cy.get('form').submit();

    cy.contains('Cypress Test Film Updated');
  });

  it('should delete a film from detail page', () => {
    cy.visit('/films');
    cy.contains('Cypress Test Film Updated').click();

    cy.get('form[action*="/delete"]').within(() => {
      cy.get('button[type="submit"]').click();
    });

    cy.url().should('include', '/films');
    cy.contains('Cypress Test Film Updated').should('not.exist');
  });

  it('should block film create page for customers', () => {
    // First log out staff
    cy.get('a[href="/logout"]').click();

    // Log in as a customer
    cy.visit('/login');
    cy.get('input[name="email"]').type(customerUser.username);
    cy.get('input[name="password"]').type(customerUser.password);
    cy.get('form').submit();

    // Try to visit create page
    cy.request({
      url: '/films/new',
      failOnStatusCode: false // don't fail test automatically on 403
    }).then((resp) => {
      expect(resp.status).to.eq(403);
      expect(resp.body).to.include('Staff access only');
    });
  });


  it('should block film create page for unauthenticated users', () => {
    cy.get('a[href="/logout"]').click();

    cy.visit('/films/new');
    cy.url().should('include', '/login');
  });
});
