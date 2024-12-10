import { describe, it, expect, beforeEach, vi } from 'vitest';
import validateDrawConditions from '../../../api/helpers/game-logic/validateDrawConditions.js';
import updateGameStateAfterDraw from '../../../api/helpers/game-logic/updateGameStateAfterDraw.js';
import publishGameState from '../../../api/helpers/game-logic/publishGameState.js';
import handleError from '../../../api/helpers/game-logic/errorHandling.js';

// Mock the global Game model
global.Game = {
  publish: vi.fn(),
};

describe('Game Logic Helpers', () => {
  let mockGame, mockUser;

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up mock game and user state
    mockGame = {
      id: 'game1',
      turn: 0,
      topCard: { id: 'card1' },
      secondCard: { id: 'card2' },
      deck: [ { id: 'card3' }, { id: 'card4' } ] ,
      log: [],
      oneOff: false,
    };

    mockUser = {
      id: 'user1',
      username: 'Player1',
      hand: [],
    };
  });

  describe('validateDrawConditions', () => {
    it('should validate when all conditions are met', () => {
      expect(() => validateDrawConditions(mockGame, 0, 0)).not.toThrow();
    });

    it('should throw an error if it is not the player\'s turn', () => {
      expect(() => validateDrawConditions(mockGame, 0, 1))
        .toThrowError('game.snackbar.global.notYourTurn');
    });

    it('should throw an error if the top card is missing', () => {
      mockGame.topCard = null;
      expect(() => validateDrawConditions(mockGame, 0, 0))
        .toThrowError('game.snackbar.draw.deckIsEmpty');
    });

    it('should throw an error if a one-off is active', () => {
      mockGame.oneOff = true;
      expect(() => validateDrawConditions(mockGame, 0, 0))
        .toThrowError("Can't play while waiting for opponent to counter");
    });
  });

  describe('updateGameStateAfterDraw', () => {
    it('should update game state after a draw', () => {
      const { gameUpdates, userUpdates } = updateGameStateAfterDraw(mockGame, mockUser);

      expect(gameUpdates.topCard).toBe('card2');
      expect(gameUpdates.log).toContain('Player1 drew a card');
      expect(gameUpdates.turn).toEqual(1);
      expect(userUpdates.frozenId).toBeNull();
    });

    it('should handle an empty deck correctly', () => {
      mockGame.deck = [];
      const { gameUpdates } = updateGameStateAfterDraw(mockGame, mockUser);

      expect(gameUpdates.secondCard).toBeNull();
    });
  });

  describe('publishGameState', () => {
    it('should call Game.publish with the correct arguments', () => {
      publishGameState(mockGame);

      expect(Game.publish).toHaveBeenCalledWith(
        [ 'game1' ] ,
        {
          change: 'draw',
          game: mockGame,
        }
      );
    });

    it('should handle missing game gracefully', () => {
      expect(() => publishGameState(null)).not.toThrow();
      expect(Game.publish).not.toHaveBeenCalled();
    });
  });

  describe('handleError', () => {
    it('should call res.badRequest with the error message', () => {
      const mockError = new Error('Something went wrong');
      const mockRes = {
        badRequest: vi.fn(),
      };

      handleError(mockError, mockRes);

      expect(mockRes.badRequest).toHaveBeenCalledWith({
        message: 'Something went wrong',
      });
    });

    it('should handle undefined error objects gracefully', () => {
      const mockRes = {
        badRequest: vi.fn(),
      };

      handleError(undefined, mockRes);

      expect(mockRes.badRequest).toHaveBeenCalledWith({
        message: 'Unknown error occurred',
      });
    });
  });
});
