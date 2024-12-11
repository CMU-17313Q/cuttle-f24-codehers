const gameHook = require('../../../api/hooks/customGameHook/index');
const sinon = require('sinon');

describe('customGameHook', () => {
  describe('findOpenGames', () => {
    let GameMock;

    beforeEach(() => {
      GameMock = {
        find: sinon.stub().returnsThis(),
        populate: sinon.stub().returnsThis(),
        exec: sinon.stub(),
      };
      global.Game = GameMock; // Mock the global Game model
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should filter and transform games correctly', async () => {
      const mockGames = [
        {
          id: '1',
          players: [
            { id: '1', username: 'PlayerOne', extraField: 'hidden' },
          ],
        },
      ];

      GameMock.exec.callsFake((callback) => callback(null, mockGames));

      const result = await gameHook().findOpenGames();

      expect(result).to.deep.equal([
        {
          id: '1',
          players: [{ id: '1', username: 'PlayerOne' }],
        },
      ]);
    });

    it('should return an empty array if no games are found', async () => {
      GameMock.exec.callsFake((callback) => callback(null, []));

      const result = await gameHook().findOpenGames();

      expect(result).to.deep.equal([]);
    });

    it('should throw an error if the query fails', async () => {
      GameMock.exec.callsFake((callback) => callback(new Error('Database error')));

      await expect(gameHook().findOpenGames()).to.be.rejectedWith('Database error');
    });
  });
});
