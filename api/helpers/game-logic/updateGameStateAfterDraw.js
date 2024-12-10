const _ = require('lodash');

module.exports = function updateGameStateAfterDraw(game, user) {
  const gameUpdates = {
    topCard: null,
    log: [...game.log, `${user.username} drew a card`],
    turn: game.turn + 1,
    lastEvent: { change: 'draw' },
  };
};
