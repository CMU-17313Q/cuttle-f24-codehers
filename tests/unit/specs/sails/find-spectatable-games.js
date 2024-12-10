const chai = require('chai');
const sinon = require('sinon');
const findSpectatableGames = require('../api/helpers/find-spectatable-games');
const Game = require('../models/Game'); // Adjust the path as necessary

const { expect } = chai;

describe('findSpectatableGames', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return games with players having only id and username', async () => {
    // Mock the Game.find method
    const mockGames = [
      {
        id: 1,
        players: [
          { id: 1, username: 'player1', email: 'player1@example.com' },
          { id: 2, username: 'player2', email: 'player2@example.com' },
        ],
      },
    ];

    sandbox.stub(Game, 'find').returns({
      populate: sinon.stub().resolves(mockGames),
    });

    const result = await findSpectatableGames.fn();

    result.forEach(game => {
      game.players.forEach(player => {
        expect(player).to.have.property('id');
        expect(player).to.have.property('username');
        expect(player).to.not.have.property('email');
      });
    });
  });
});
