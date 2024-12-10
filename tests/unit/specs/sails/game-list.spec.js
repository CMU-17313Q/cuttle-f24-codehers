import { beforeEach, describe, it, expect, vi, afterEach } from 'vitest';
import { findSpectatableGames } from '../../../api/helpers/find-spectatable-games';
import { Game } from '../../../models/Game';

describe('findSpectatableGames', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return games with players having only id and username, without player counts', async () => {
    // Mock the Game.find method
    const mockGames = [
      {
        id: 1,
        players: [
          { id: 1, username: 'player1' },
          { id: 2, username: 'player2' },
        ],
      },
      {
        id: 2,
        players: [
          { id: 3, username: 'player3' },
        ],
      },
      {
        id: 3,
        players: [],
      },
    ];

    // Mock the database query and populate method
    vi.spyOn(Game, 'find').mockReturnValue({
      populate: vi.fn().mockResolvedValue(mockGames),
    });

    const result = await findSpectatableGames.fn();

    // Assert the structure and absence of player counts
    result.forEach(game => {
      expect(game).toHaveProperty('id');
      expect(game).toHaveProperty('players');
      expect(Array.isArray(game.players)).toBe(true);

      // Ensure there is no player count or additional properties
      expect(game).not.toHaveProperty('numPlayers');

      // Validate players array
      game.players.forEach(player => {
        expect(player).toHaveProperty('id');
        expect(player).toHaveProperty('username');
        expect(Object.keys(player).length).toBe(2); // Only id and username
      });
    });
  });
});

