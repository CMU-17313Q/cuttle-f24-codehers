import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import findSpectatableGames from '../../../api/helpers/find-spectatable-games';
import Game from '../../../models/Game'; // Adjust the path as necessary

describe('findSpectatableGames', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

    vi.spyOn(Game, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockGames),
    });

    const result = await findSpectatableGames.fn();

    result.forEach(game => {
      game.players.forEach(player => {
        expect(player).toHaveProperty('id');
        expect(player).toHaveProperty('username');
        expect(player).not.toHaveProperty('email');
      });
    });
  });
});