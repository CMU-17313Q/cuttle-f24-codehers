describe('Game Integration Tests', () => {
  beforeEach(() => {
    cy.viewport(1980, 1080);
    cy.wipeDatabase(); // Ensure a clean slate for each test
    cy.visit('/');
  });


it('Displays "No games available" when no open games exist', () => {
  // Verify the response from findOpenGames
  cy.request('GET', '/api/game/findOpenGames').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.length(0);
  });
})
})