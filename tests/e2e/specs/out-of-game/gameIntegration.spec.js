describe('Game Integration Tests', () => {
  beforeEach(() => {
    cy.viewport(1980, 1080);
    cy.wipeDatabase(); // Ensure a clean slate for each test
    cy.visit('/');
  });
})
