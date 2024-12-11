describe('Game Integration Tests', () => {
  beforeEach(() => {
    cy.viewport(1980, 1080);
    cy.wipeDatabase(); // Ensure a clean slate for each test
  });

  it('Displays "No games available" when no open games exist', () => {
    // Verify the response from findOpenGames
    cy.request('GET', '/api/game/findOpenGames').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(0);
    });

    // Visit the home page and verify the UI
    cy.visit('/');
    cy.get('[data-cy=game-list]').should('contain', 'No games available');
  });

  it('Displays a single-player game correctly', () => {
    // Create a single-player game
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

  it('Handles players joining and leaving games dynamically', () => {
    // Create a game with one player
    cy.request('POST', '/api/game/create', {
      name: 'Dynamic Game',
      players: [{ id: '1', username: 'PlayerOne' }],
    }).then((response) => {
      expect(response.status).to.eq(200);
      const gameId = response.body.id;

      // Add a second player using joinGame
      cy.request('POST', `/api/game/${gameId}/join`, {
        player: { id: '2', username: 'PlayerTwo' },
      }).then((joinResponse) => {
        expect(joinResponse.status).to.eq(200);
      });

      // Verify the game list updates
      cy.visit('/');
      cy.get('[data-cy=game-list-item]').should('contain', 'PlayerOne vs PlayerTwo');

      // Remove the first player using otherLeftGame
      cy.request('POST', `/api/game/${gameId}/leave`, { playerId: '1' }).then(
        (leaveResponse) => {
          expect(leaveResponse.status).to.eq(200);
        },
      );

      // Verify the updated game list
      cy.visit('/');
      cy.get('[data-cy=game-list-item]').should('contain', 'PlayerTwo').and('contain', 'Empty');
    });
  });

  it('Displays spectatable games correctly', () => {
    // Create a game with two players and set its status to STARTED
    cy.request('POST', '/api/game/create', {
      name: 'Spectatable Game',
      players: [
        { id: '1', username: 'PlayerOne' },
        { id: '2', username: 'PlayerTwo' },
      ],
      status: 'STARTED',
    }).then((response) => {
      expect(response.status).to.eq(200);
    });

    // Verify the spectatable games API response
    cy.request('GET', '/api/game/findSpectatableGames').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body[0].players).to.deep.include.members([
        { id: '1', username: 'PlayerOne' },
        { id: '2', username: 'PlayerTwo' },
      ]);
    });

    // Verify the frontend displays spectatable games correctly
    cy.visit('/');
    cy.get('[data-cy=game-list-item]').should(
      'contain',
      'PlayerOne vs PlayerTwo',
    );
  });
});
