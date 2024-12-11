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

  // Verify the frontend behavior
  cy.get('[data-cy=game-list]').should('contain', 'No games available');
});

it('Displays a single-player game correctly', () => {
  // Create a single-player game using findOpenGames
  cy.request('POST', '/api/game/create', {
    name: 'Single Player Game',
    players: [{ id: '1', username: 'PlayerOne' }],
  }).then((response) => {
    expect(response.status).to.eq(200);
  });

  // Visit the home page and verify the game list
  cy.visit('/');
  cy.get('[data-cy=game-list-item]')
    .should('contain', 'PlayerOne')
    .and('contain', 'Empty');
});

})
