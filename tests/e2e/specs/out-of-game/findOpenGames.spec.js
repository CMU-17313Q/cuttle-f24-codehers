describe('Find Open Games', () => {
  beforeEach(() => {
    cy.viewport(1980, 1080);
    cy.wipeDatabase(); // Clear existing data
    cy.visit('/home'); // Visit the home page
  });

  it('Displays "No games available" when no open games exist', () => {
    cy.get('[data-cy=game-list]').should('contain', 'No games available');
  });

  it('Displays a game with one player correctly', () => {
    cy.request('POST', '/api/game/create', {
      name: 'Single Player Game',
      players: [{ id: '1', username: 'PlayerOne' }],
    });

    cy.visit('/home');
    cy.get('[data-cy=game-list-item]')
      .should('contain', 'Single Player Game')
      .and('contain', 'vs PlayerOne');
  });

  it('Displays a game with two players correctly', () => {
    cy.request('POST', '/api/game/create', {
      name: 'Two Player Game',
      players: [
        { id: '1', username: 'PlayerOne' },
        { id: '2', username: 'PlayerTwo' },
      ],
    });

    cy.visit('/home');
    cy.get('[data-cy=game-list-item]')
      .should('contain', 'Two Player Game')
      .and('contain', 'PlayerOne vs PlayerTwo');
  });
});
