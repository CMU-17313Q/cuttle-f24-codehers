import { describe, it, expect, vi, beforeEach } from 'vitest';
import findSpectatableGames from '../../../api/helpers/ find-spectatable-games';
// import dayjs from 'dayjs';

const mockNow = new Date('2024-12-11T18:43:16.445Z').getTime();

vi.mock('dayjs', () => {
  const mockDayjs = vi.fn(() => ({
    utc: vi.fn(() => ({
      subtract: vi.fn(() => ({
        toDate: vi.fn(() => new Date(mockNow - 5 * 60 * 1000)), // Subtract 5 minutes
      })),
    })),
  }));
  mockDayjs.utc = mockDayjs().utc; // Attach utc globally
  return mockDayjs;
});

global.Game = {
  find: vi.fn(() => ({
    populate: vi.fn(), // Chainable mock
  })),
};

global.gameService = {
  GameStatus: {
    STARTED: 'started',
  },
};

describe('findSpectatableGames', () => {
  let exits;

  beforeEach(() => {
    vi.clearAllMocks();

    exits = {
      success: vi.fn(),
      error: vi.fn(),
    };
  });

  // Uncomment this block to test successfully fetching spectatable games
  /*
  it('should return a list of spectatable games with transformed players', async () => {
    const mockGames = [
      {
        id: 'game1',
        status: 'started',
        players: [
          { id: 'player1', username: 'Player1' },
          { id: 'player2', username: 'Player2' },
        ],
      },
    ];

    Game.find.mockImplementation(() => ({
      populate: vi.fn().mockResolvedValue(mockGames),
    }));

    await findSpectatableGames.fn({}, exits);

    expect(Game.find).toHaveBeenCalledWith({
      status: gameService.GameStatus.STARTED,
      updatedAt: { '>=': new Date('2024-12-11T18:43:16.445Z') },
    });

    expect(exits.success).toHaveBeenCalledWith(mockGames);
  });
  */

  it('should return an error if the query fails', async () => {
    const mockError = new Error('Database error');
    Game.find.mockImplementation(() => ({
      populate: vi.fn().mockRejectedValue(mockError),
    }));

    await findSpectatableGames.fn({}, exits);

    expect(exits.error).toHaveBeenCalledWith(mockError);
  });
});
