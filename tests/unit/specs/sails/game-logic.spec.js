import { describe, it, expect, beforeEach } from 'vitest';
import draw from '../../../api/controllers/game/draw';
import * as gameService from '../../../api/services/gameService';
import * as userService from '../../../api/services/userService';


// Mock services
vi.mock('../../../api/services/gameService');
vi.mock('../../../api/services/userService');

// Utility to strip attributes added while saving to the database
function stripDbAttributes(obj) {
  const attributesToRemove = [ 'createdAt', 'id', 'updatedAt' ];
  attributesToRemove.forEach((attr) => delete obj[attr]);
}

describe('Game Logic: Draw Controller', () => {
  let testGame, testUser;

  beforeEach(async () => {
    await sails.helpers.wipeDatabase();

  
    // Mock game state
    testGame = {
      id: 'game1',
      turn: 0,
      topCard: { id: 'card1' },
      secondCard: { id: 'card2' },
      deck: [{ id: 'card3' }, { id: 'card4' }],
      log: [],
      oneOff: false,
    };
        // Mock user state
        testUser = {
          id: 'user1',
          username: 'Player1',
          hand: [],
        };
    
        // Mock service responses
        gameService.findGame.mockResolvedValue(testGame);
        userService.findUser.mockResolvedValue(testUser);
      });

    });