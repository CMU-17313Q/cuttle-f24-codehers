import { describe, it, expect, beforeEach, vi } from 'vitest';
import gameHook from '../../../api/hooks/customGameHook/index.js';

global.gameService = {
  GameStatus: {
    CREATED: 'created',
  },
};

global.Game = {
  create: vi.fn(),
  find: vi.fn(),
  findOne: vi.fn(),
};

describe('customGameHook', () => {
  let hook;

  beforeEach(() => {
    vi.clearAllMocks();
    hook = gameHook();
  });

  describe('createGame', () => {
    it('should create a game successfully', async () => {
      const mockGame = { id: 'game1', name: 'Test Game', isRanked: true, status: gameService.GameStatus.CREATED };
      Game.create.mockReturnValueOnce({
        fetch: vi.fn().mockResolvedValue(mockGame),
      });

      const result = await hook.createGame('Test Game', true);
      expect(result).toEqual(mockGame);
      expect(Game.create).toHaveBeenCalledWith({
        name: 'Test Game',
        isRanked: true,
        status: gameService.GameStatus.CREATED,
      });
    });

    it('should handle errors during game creation', async () => {
      Game.create.mockReturnValueOnce({
        fetch: vi.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(hook.createGame('Test Game', true)).rejects.toThrow('Database error');
    });
  });

  describe('findOpenGames', () => {
    it('should find open games with less than 2 players', async () => {
      const mockGames = [
        { id: 'game1', players: [{ id: 'player1', username: 'Player1' }] },
      ];

      Game.find.mockReturnValueOnce({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockImplementation((callback) => callback(null, mockGames)),
      });

      const openGames = await hook.findOpenGames();
      expect(openGames).toHaveLength(1);
      expect(openGames[0].players).toEqual([{ id: 'player1', username: 'Player1' }]);
    });

    it('should return an error if no games are found', async () => {
      Game.find.mockReturnValueOnce({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockImplementation((callback) => callback(null, [])),
      });

      await expect(hook.findOpenGames()).rejects.toEqual({ message: "Can't find games" });
    });
  });

  describe('findGame', () => {
    it('should retrieve a game by ID with populated relations', async () => {
      const mockGame = { id: 'game1', players: [{ id: 'player1', username: 'Player1' }] };

      Game.findOne.mockReturnValueOnce({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockImplementation((callback) => callback(null, mockGame)),
      });

      const result = await hook.findGame('game1');
      expect(result).toEqual(mockGame);
      expect(Game.findOne).toHaveBeenCalledWith('game1');
    });

    it('should return an error if no game is found', async () => {
      Game.findOne.mockReturnValueOnce({
        populate: vi.fn().mockReturnThis(),
        exec: vi.fn().mockImplementation((callback) => callback(null, null)),
      });

      await expect(hook.findGame('game1')).rejects.toEqual({ message: 'home.snackbar.cantFindGame' });
    });
  });
});
